import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tokenizeRoot } from "./root-lexer.js";
import { parseRoot } from "./root-parser.js";
import { transformOutput } from "./output-transformer.js";

const outputVarName = "o" + crypto.randomUUID().replace(/-/g, "");

/**
 * @param sourcePath - the absolute path to the `.dood` source file
 */
export async function compilePath(sourcePath: string) {
  const source = await fs.readFile(sourcePath, "utf8");
  const sourceDir = path.dirname(sourcePath);
  const rootTokens = tokenizeRoot(source);
  const rootAST = parseRoot(rootTokens);
  const transformedOutput = transformOutput(rootAST.output.contents);
  const concatenatedSetupOutput = `
    ${rootAST.setup.contents}
    export const ${outputVarName} = \`${transformedOutput}\`;
  `;
  // Write a temporary file to disk
  const tempPath = path.join(sourceDir, `.doodl_${outputVarName}.ts`);
  await fs.writeFile(tempPath, concatenatedSetupOutput);
  const compiledOutput = (await import(tempPath))[outputVarName];
  await fs.unlink(tempPath);
  return compiledOutput;
}
