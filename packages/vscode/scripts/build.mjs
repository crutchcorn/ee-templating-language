#!/usr/bin/env node
import {createRequire} from 'node:module'
import process from 'node:process'
import {fileURLToPath} from 'node:url'
import {build} from 'esbuild'

const require = createRequire(import.meta.url)

const debug = process.argv.includes('debug')

await build({
  bundle: true,
  entryPoints: {
    'out/extension': require.resolve('../src/extension.ts'),
    'out/language-server': require.resolve('doodl-language-server'),
    'node_modules/doodl-typescript-plugin': require.resolve(
      '../../typescript-plugin/lib/index.cjs'
    )
  },
  external: ['vscode'],
  logLevel: 'info',
  minify: !debug,
  outdir: fileURLToPath(new URL('../', import.meta.url)),
  platform: 'node',
  sourcemap: debug
})