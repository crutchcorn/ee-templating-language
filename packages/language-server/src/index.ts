#!/usr/bin/env node

import process from 'node:process';
import {
  createDoodlLanguagePlugin,
  createDoodlServicePlugin
} from '../../language-service/lib/src/index.js';
import {
  createConnection,
  createServer,
  createSimpleProject
} from '@volar/language-server/node.js';
import type { 
  InitializeParams, 
  InitializeResult 
} from '@volar/language-server';

process.title = 'doodl-language-server';

const connection = createConnection();
const server = createServer(connection);

connection.onInitialize(async (parameters: InitializeParams): Promise<InitializeResult> => {
  return server.initialize(
    parameters,
    createSimpleProject([
      createDoodlLanguagePlugin()
    ]),
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