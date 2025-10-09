'use strict'

const {
  createDoodlLanguagePlugin,
  createDoodlServicePlugin
} = require('doodl-language-service')
const {
  createLanguageServicePlugin
} = require('@volar/typescript/lib/quickstart/createLanguageServicePlugin.js')

const plugin = createLanguageServicePlugin((ts, info) => {
  return {
    languagePlugins: [createDoodlLanguagePlugin()],
    servicePlugins: [createDoodlServicePlugin()]
  }
})

module.exports = plugin