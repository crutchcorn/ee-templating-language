import { test, expect } from "vitest";
import { tokenizeRoot } from "../src/root-lexer";

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

test("tokenizeRoot", {}, () => {
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
