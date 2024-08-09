import { test, expect } from "vitest";
import { tokenizeRoot } from "../src/root-lexer.js";

test("tokenizeRoot basic", {}, () => {
    const source = `
<setup>
const setup = 123;
</setup>

<output lang="json">
{
  "test": <<setup>>
}
</output>
`.trim();

    const tokens = tokenizeRoot(source);
    expect(tokens).toStrictEqual([
        { type: 'TagOpen', attributes: { name: 'setup' } },
        { type: 'Text', attributes: { value: '\nconst setup = 123;\n' } },
        { type: 'TagClose', attributes: { name: 'setup' } },
        { type: 'Text', attributes: { value: '\n\n' } },
        { type: 'TagOpen', attributes: { name: 'output' } },
        { type: 'TagAttribute', attributes: { name: 'lang', value: 'json' } },
        { type: 'Text', attributes: { value: '\n{\n  "test": <' } },
        { type: 'TagOpen', attributes: { name: 'setup' } },
        { type: 'Text', attributes: { value: '>\n}\n' } },
        { type: 'TagClose', attributes: { name: 'output' } }
    ]
    );
})

test("tokenizeRoot with other things inside of interpolation", {}, () => {
  const source = `
  <setup>
const hello = 123;
</setup>

<output lang="json">
{
    "test": <<hello ? ["one", 'two', 'three'] : "">>
}
</output>
`.trim();

  const tokens = tokenizeRoot(source);
  expect(tokens).toStrictEqual([
      { type: 'TagOpen', attributes: { name: 'setup' } },
      { type: 'Text', attributes: { value: '\nconst hello = 123;\n' } },
      { type: 'TagClose', attributes: { name: 'setup' } },
      { type: 'Text', attributes: { value: '\n\n' } },
      { type: 'TagOpen', attributes: { name: 'output' } },
      { type: 'TagAttribute', attributes: { name: 'lang', value: 'json' } },
      { type: 'Text', attributes: { value: '\n{\n    "test": <' } },
      { type: 'TagOpen', attributes: { name: 'hello' } },
      { type: 'Text', attributes: { value: ' ? ["one", \'two\', \'three\'] : ""' } },
      { type: 'Text', attributes: { value: '>\n}\n' } },
      { type: 'TagClose', attributes: { name: 'output' } }
  ]
  );
})
