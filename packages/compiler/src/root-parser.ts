import { RootToken } from "./root-tokens";

interface RootNode {
    setup: SetupNode;
    output: OutputNode;
}

interface SetupNode {
    attributes: { [key: string]: string };
    contents: string;
}

interface OutputNode {
    attributes: { [key: string]: string };
    contents: string;
}

export function parseRoot(tokens: RootToken[]): RootNode {
    const rootNode: RootNode = {
        setup: { attributes: {}, contents: "" },
        output: { attributes: {}, contents: "" },
    };

    let currentTag: keyof RootNode | null = null;

    for (const token of tokens) {
        // If text token and is all whitespace, skip
        if (token.type === "Text" && !token.attributes.value.trim()) {
            continue;
        }
        if (!currentTag && token.type === "TagOpen") {
            currentTag = token.attributes.name as keyof RootNode;
            continue;
        }
        if (currentTag && token.type === "TagClose" && token.attributes.name === currentTag) {
            currentTag = null;
            continue;
        }
        if (currentTag && token.type === "TagAttribute") {
            rootNode[currentTag].attributes[token.attributes.name] = token.attributes.value;
            continue;
        }
        if (currentTag) {
            let value = "";
            if (token.type === "TagOpen") {
                value = `<${token.attributes.name}>`;
            }
            if (token.type === "TagClose") {
                value = `</${token.attributes.name}>`;
            }
            if (token.type === "TagAttribute") {
                value = ` ${token.attributes.name}="${token.attributes.value}"`;
            }
            if (token.type === "Text") {
                value = token.attributes.value;
            }
            rootNode[currentTag].contents += value;
        }
    }
    
    return rootNode;
}