import * as fs from "node:fs/promises";
import * as path from "node:path";
import esbuild from "esbuild";
import { tokenizeRoot } from "./root-lexer.js";
import { parseRoot } from "./root-parser.js";
import { transformOutput } from "./output-transformer.js";

const outputVarName = crypto.randomUUID().replace(/-/g, "_");

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
  const result = await esbuild.transform(concatenatedSetupOutput, {
    loader: "ts",
    target: "esnext",
  });
  // Write a temporary file to disk
  const tempPath = path.join(sourceDir, `.doodl_${outputVarName}.ts`);
  await fs.writeFile(tempPath, result.code);
  const compiledOutput = (await import(tempPath))[outputVarName];
  await fs.unlink(tempPath);
  return compiledOutput;
}
