import * as vscode from 'vscode';

export async function activate(_context: vscode.ExtensionContext) {
	// The TypeScript plugin is automatically loaded by VS Code's TypeScript service
	// when it's configured in the workspace's tsconfig.json or VS Code settings
	
	// Add configuration to suggest users enable the plugin
	const config = vscode.workspace.getConfiguration();
	const tsConfig = config.get('typescript.preferences') as any || {};
	
	if (!tsConfig.plugins || !tsConfig.plugins.find((p: any) => p.name === 'doodl-typescript-plugin')) {
		// Show a notification to configure the TypeScript plugin
		const action = await vscode.window.showInformationMessage(
			'To enable Doodl language features, add the TypeScript plugin to your workspace settings or tsconfig.json',
			'Configure Now',
			'Learn More'
		);
		
		if (action === 'Configure Now') {
			// Try to update workspace settings
			await config.update('typescript.preferences.plugins', [
				...(tsConfig.plugins || []),
				{ name: 'doodl-typescript-plugin' }
			], vscode.ConfigurationTarget.Workspace);
			
			// Restart TypeScript service to pick up the plugin
			await vscode.commands.executeCommand('typescript.restartTsServer');
		} else if (action === 'Learn More') {
			vscode.env.openExternal(vscode.Uri.parse('https://github.com/crutchcorn/doodl#typescript-plugin'));
		}
	}
}

export function deactivate(): void {
	// TypeScript plugin cleanup is handled by VS Code's TypeScript service
}
