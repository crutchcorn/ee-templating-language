import { Diagnostic } from '@volar/language-service';
import { URI } from 'vscode-uri';
import { DoodlVirtualCode } from './language-plugin.js';

export function createDoodlServicePlugin() {
  return {
    capabilities: {
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false },
    },
    create(context: any) {
      return {
        provideDiagnostics(document: any) {
          const decoded = context.decodeEmbeddedDocumentUri(URI.parse(document.uri));
          if (!decoded) {
            // Not a embedded document
            return;
          }
          const virtualCode = context.language.scripts.get(decoded[0])?.generated?.embeddedCodes.get(decoded[1]);
          if (!(virtualCode instanceof DoodlVirtualCode)) {
            return;
          }
          const setupNodes = virtualCode.htmlDocument.roots.filter((root: any) => root.tag === 'setup');
          const outputNodes = virtualCode.htmlDocument.roots.filter((root: any) => root.tag === 'output');

          if (setupNodes.length == 1 && outputNodes.length == 1) {
            return;
          }

          const errors: Diagnostic[] = [];

          if (setupNodes.length === 0) {
            errors.push({
              severity: 1,
              range: {
                start: document.positionAt(0),
                end: document.positionAt(1),
              },
              source: 'doodl',
              message: 'Missing setup tag.',
            });
          }

          if (outputNodes.length === 0) {
            errors.push({
              severity: 1,
              range: {
                start: document.positionAt(0),
                end: document.positionAt(1),
              },
              source: 'doodl',
              message: 'Missing output tag.',
            });
          }

          for (let i = 1; i < setupNodes.length; i++) {
            errors.push({
              severity: 2,
              range: {
                start: document.positionAt(setupNodes[i].start),
                end: document.positionAt(setupNodes[i].end),
              },
              source: 'doodl',
              message: 'Only one setup tag is allowed.',
            });
          }

          for (let i = 1; i < outputNodes.length; i++) {
            errors.push({
              severity: 2,
              range: {
                start: document.positionAt(outputNodes[i].start),
                end: document.positionAt(outputNodes[i].end),
              },
              source: 'doodl',
              message: 'Only one output tag is allowed.',
            });
          }
          return errors;
        },
      };
    },
  };
}