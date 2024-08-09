import * as ts from "typescript";
import {tokenizeRoot} from "./root-lexer.js";
import {parseRoot} from "./root-parser.js";
import {transformOutput} from "./output-transformer.js";

export function compile(
  source: string,
  options: ts.TranspileOptions
) {
  const rootTokens = tokenizeRoot(source);
  const rootAST = parseRoot(rootTokens);
  const transformedOutput = transformOutput(rootAST.output.contents);
  const concatenatedSetupOutput = `    
    ${rootAST.setup.contents}
    return \`${transformedOutput}\`;
  `;
  const program = ts.transpileModule(concatenatedSetupOutput, options);
  const compiledOutput = new Function(program.outputText)();
  return compiledOutput;
}
