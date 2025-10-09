#!/usr/bin/env node

import assert from 'node:assert';
import process from 'node:process';
import {
  createDoodlLanguagePlugin,
  createDoodlServicePlugin
} from '../../language-service/lib/src/index.js';
import {
  createConnection,
  createServer,
  createTypeScriptProject,
  loadTsdkByPath
} from '@volar/language-server/node.js';
import type { 
  InitializeParams, 
  InitializeResult 
} from '@volar/language-server';

process.title = 'doodl-language-server';

const connection = createConnection();
const server = createServer(connection);

connection.onInitialize(async (parameters: InitializeParams): Promise<InitializeResult> => {
  const tsdk = parameters.initializationOptions?.typescript?.tsdk;
  
  assert.ok(
    typeof tsdk === 'string',
    'Missing initialization option typescript.tsdk'
  );

  const { typescript, diagnosticMessages } = loadTsdkByPath(
    tsdk,
    parameters.locale
  );

  return server.initialize(
    parameters,
    createTypeScriptProject(
      typescript,
      diagnosticMessages,
      () => ({
        languagePlugins: [createDoodlLanguagePlugin()]
      })
    ),
    [
      createDoodlServicePlugin()
    ]
  );
});

connection.onInitialized(() => {
  server.initialized();
  server.fileWatcher?.watchFiles(['**/*.dood']);
});

connection.listen();