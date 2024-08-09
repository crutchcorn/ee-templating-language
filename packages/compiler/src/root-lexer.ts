interface Attribute {
  name: string;
  value: string;
}

interface Tag {
  name: string;
}

interface Text {
  value: string;
}

const keywords = [
  { match: /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/, type: "TagOpen", attributes: {} as Tag },
  { match: /<\/([a-zA-Z][a-zA-Z0-9]*)>/, type: "TagClose", attributes: {} as Tag },
  { match: /([a-zA-Z-]+)="([^"]*)"/, type: "TagAttribute", attributes: {} as Attribute },
  { match: /[^<]+/, type: "Text", attributes: {} as Text },
];

type Token = {
  type: "TagOpen";
  attributes: Tag;
} | {
  type: "TagClose";
  attributes: Tag;
} | {
  type: "TagAttribute";
  attributes: Attribute;
} | {
  type: "Text";
  attributes: Text;
};

export function tokenizeRoot(source: string): Token[] {
  const tokens: Token[] = [];
  const tagRegex = /<\/?(setup|output)(\s+[^>]*)?>|<\/?(setup|output)>|([^<]+)/g;
  let match;

  while ((match = tagRegex.exec(source)) !== null) {
    if (match[1]) {
      // Opening tag with attributes
      tokens.push({ type: "TagOpen", attributes: {name: match[1]} });
      if (match[2]) {
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(match[2])) !== null) {
          tokens.push({ type: "TagAttribute",
            attributes: { name: attrMatch[1], value: attrMatch[2] } });
        }
      }
    } else if (match[3]) {
      // Closing tag
      tokens.push({ type: "TagClose", attributes: {name: match[3]} });
    } else if (match[4]) {
      // Text content
      tokens.push({ type: "Text", attributes: {value: match[4]} });
    }
  }

  return tokens;
}