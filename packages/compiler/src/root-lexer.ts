import { RootToken } from "./root-tokens";

export function tokenizeRoot(source: string): RootToken[] {
  const tokens: RootToken[] = [];
  const tagRegex = /<\/?(setup|output)(\s+[^>]*)?>|([^<]+)/g;
  let match;

  while ((match = tagRegex.exec(source)) !== null) {
    if (match[0].startsWith("</")) {
      // Closing tag
      tokens.push({ type: "TagClose", attributes: { name: match[1] } });
    } else if (match[1]) {
      // Opening tag with attributes
      tokens.push({ type: "TagOpen", attributes: { name: match[1] } });
      if (match[2]) {
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(match[2])) !== null) {
          tokens.push({
            type: "TagAttribute",
            attributes: { name: attrMatch[1], value: attrMatch[2] }
          });
        }
      }
    } else if (match[3]) {
      // Text content
      tokens.push({ type: "Text", attributes: { value: match[3] } });
    }
  }

  return tokens;
}