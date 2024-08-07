## Running the Extension

- Run `pnpm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a `test.js.ee`
  - Type `<setu|` to try HTML completion
  - Type `<setup>console.| }</setup>` to try CSS completion

## Build .vsix

- Run `pnpm run pack` in this folder
- `packages/vscode/vscode-ee-0.0.1.vsix` will be created, and you can manual install it to VSCode.

## References

- https://github.com/volarjs/starter
- https://code.visualstudio.com/api/language-extensions/embedded-languages
- https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service
- https://github.com/analogjs/language-tools