import * as languageServerProtocol from '@volar/language-server/protocol.js';
import {
  activateAutoInsertion,
  activateDocumentDropEdit,
  createLabsInfo,
  getTsdk
} from '@volar/vscode';
import {
  extensions,
  window,
  workspace,
  Disposable,
  ProgressLocation,
  ExtensionContext
} from 'vscode';
import { LanguageClient, TransportKind } from '@volar/vscode/node.js';

let client: LanguageClient | undefined;
let disposable: Disposable | undefined;

export async function activate(context: ExtensionContext) {
  // Activate TypeScript extension first
  extensions.getExtension('vscode.typescript-language-features')?.activate();

  // Get TypeScript SDK path
  const { tsdk } = (await getTsdk(context)) ?? { tsdk: '' };

  // Create language client
  client = new LanguageClient(
    'Doodl',
    {
      module: context.asAbsolutePath('./dist/language-server.js'),
      transport: TransportKind.ipc
    },
    {
      documentSelector: [{ language: 'doodl' }],
      initializationOptions: {
        typescript: { tsdk }
      },
      middleware: {}
    }
  );

  // Start server initially if enabled
  tryRestartServer();

  // Watch for configuration changes
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('doodl.server.enable')) {
        tryRestartServer();
      }
    })
  );

  // Create Volar Labs integration
  const volarLabs = createLabsInfo(languageServerProtocol);
  volarLabs.addLanguageClient(client);

  return volarLabs.extensionExports;

  async function tryRestartServer() {
    await stopServer();
    if (workspace.getConfiguration('doodl').get('server.enable')) {
      await startServer();
    }
  }
}

export async function deactivate() {
  await stopServer();
}

async function stopServer() {
  if (client?.needsStop()) {
    disposable?.dispose();
    await client.stop();
  }
}

async function startServer() {
  if (client?.needsStart()) {
    await window.withProgress(
      {
        location: ProgressLocation.Window,
        title: 'Starting Doodl Language Server…'
      },
      async () => {
        await client!.start();

        disposable = Disposable.from(
          activateAutoInsertion('doodl', client!),
          activateDocumentDropEdit('doodl', client!)
        );
      }
    );
  }
}
