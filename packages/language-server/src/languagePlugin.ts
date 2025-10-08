import { CodeMapping, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from '@volar/language-core';
import { TypeScriptExtraServiceScript } from "@volar/typescript";
import type * as ts from 'typescript';
import * as html from 'vscode-html-languageservice';
import { URI } from 'vscode-uri';

export const eeLanguagePlugin = {
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
} satisfies LanguagePlugin<URI>;

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

	// If we have both setup and output, combine them into a single TypeScript context
	// This allows setup variables to be accessible in output interpolations
	if (setups.length > 0 && outputs.length > 0) {
		const setup = setups[0]; // Take the first setup block
		const output = outputs[0]; // Take the first output block

		if (!setup.startTagEnd || !setup.endTagStart ||
			!output.startTagEnd || !output.endTagStart) {
			return;
		}

		const setupText = snapshot.getText(setup.startTagEnd, setup.endTagStart);
		const outputText = snapshot.getText(output.startTagEnd, output.endTagStart);

		// Extract interpolation expressions from output
		const interpolations = extractInterpolations(outputText);

		// Create a combined TypeScript context wrapped in a module
		// This ensures each .ee file has its own isolated scope
		const base = `export {}; // Make this file a module\n\n`
		let combinedText = `${base}${setupText}\n\n// Output interpolations:\n`;
		interpolations.forEach((interp, index) => {
			combinedText += `const __interp_${index} = ${interp};\n`;
		});

		yield {
			id: 'combined_context',
			languageId: 'typescript',
			snapshot: {
				getText: (start, end) => combinedText.substring(start, end),
				getLength: () => combinedText.length,
				getChangeRange: () => undefined,
			},
			mappings: [
				// Mapping for setup block
				{
					sourceOffsets: [setup.startTagEnd],
					generatedOffsets: [base.length],
					lengths: [setupText.length],
					data: {
						completion: true,
						format: true,
						navigation: true,
						semantic: true,
						structure: true,
						verification: true,
					},
				}
			],
			embeddedCodes: [],
		};
	}
}

function extractInterpolations(text: string): string[] {
	const interpolations: string[] = [];
	let i = 0;
	const length = text.length;

	while (i < length) {
		if (text[i] === '<' && text[i + 1] === '<') {
			let j = i + 2;
			let depth = 1;

			// Find the matching >>
			while (j < length && depth > 0) {
				if (text[j] === '<' && text[j + 1] === '<') {
					depth++;
					j += 2;
				} else if (text[j] === '>' && text[j + 1] === '>') {
					depth--;
					if (depth === 0) {
						// Extract the interpolation content
						const interpolation = text.substring(i + 2, j).trim();
						if (interpolation) {
							interpolations.push(interpolation);
						}
						i = j + 2;
						break;
					}
					j += 2;
				} else {
					j++;
				}
			}

			if (depth > 0) {
				// Unclosed interpolation, skip
				i++;
			}
		} else {
			i++;
		}
	}

	return interpolations;
}
