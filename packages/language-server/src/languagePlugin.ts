import { CodeMapping, TypeScriptExtraServiceScript, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from '@volar/language-core';
import type * as ts from 'typescript';
import * as html from 'vscode-html-languageservice';
import { URI } from 'vscode-uri';

export const eeLanguagePlugin: LanguagePlugin<URI> = {
	getLanguageId(uri) {
		if (uri.path.endsWith('.ee')) {
			return 'ee';
		}
	},
	createVirtualCode(_uri, languageId, snapshot) {
		if (languageId === 'ee') {
			return new EEVirtualCode(snapshot);
		}
	},
	typescript: {
		extraFileExtensions: [{ extension: 'ee', isMixedContent: true, scriptKind: 3 satisfies ts.ScriptKind.TS }],
		getServiceScript() {
			return undefined;
		},
		getExtraServiceScripts(fileName, root) {
			const scripts: TypeScriptExtraServiceScript[] = [];
			for (const code of forEachEmbeddedCode(root)) {
				if (code.languageId === 'typescript') {
					scripts.push({
						fileName: fileName + '.' + code.id + '.ts',
						code,
						extension: '.ts',
						scriptKind: 3 satisfies ts.ScriptKind.TS,
					});
				}
			}
			return scripts;
		},
	},
};

const htmlLs = html.getLanguageService();

export class EEVirtualCode implements VirtualCode {
	id = 'root';
	languageId = 'html';
	mappings: CodeMapping[];
	embeddedCodes: VirtualCode[] = [];

	// Reuse in custom language service plugin
	htmlDocument: html.HTMLDocument;

	constructor(public snapshot: ts.IScriptSnapshot) {
		this.mappings = [{
			sourceOffsets: [0],
			generatedOffsets: [0],
			lengths: [snapshot.getLength()],
			data: {
				completion: true,
				format: true,
				navigation: true,
				semantic: true,
				structure: true,
				verification: true,
			},
		}];
		this.htmlDocument = htmlLs.parseHTMLDocument(html.TextDocument.create('', 'html', 0, snapshot.getText(0, snapshot.getLength())));
		this.embeddedCodes = [...getEEEmbeddedCodes(snapshot, this.htmlDocument)];
	}
}

function* getEEEmbeddedCodes(snapshot: ts.IScriptSnapshot, htmlDocument: html.HTMLDocument): Generator<VirtualCode> {
	const setups = htmlDocument.roots.filter(root => root.tag === 'setup');
	const outputs = htmlDocument.roots.filter(root => root.tag === 'output');

	for (let i = 0; i < setups.length; i++) {
		const setup = setups[i];
		if (setup.startTagEnd !== undefined && setup.endTagStart !== undefined) {
			const text = snapshot.getText(setup.startTagEnd, setup.endTagStart);
			yield {
				id: 'setup_' + i,
				languageId: 'typescript',
				snapshot: {
					getText: (start, end) => text.substring(start, end),
					getLength: () => text.length,
					getChangeRange: () => undefined,
				},
				mappings: [{
					sourceOffsets: [setup.startTagEnd],
					generatedOffsets: [0],
					lengths: [text.length],
					data: {
						completion: true,
						format: true,
						navigation: true,
						semantic: true,
						structure: true,
						verification: true,
					},
				}],
				embeddedCodes: [],
			};
		}
	}
}
