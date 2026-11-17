// Developer Extra Tools Suite for ToolifyPro

export function formatHTML(html: string): string {
  let formatted = "";
  let indent = 0;
  const tab = "  ";

  // Normalize spaces around tags
  const tokens = html.replace(/>\s*</g, "><").split(/(<[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      formatted += "\n" + tab.repeat(indent) + token;
    } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !isVoidTag(token)) {
      formatted += "\n" + tab.repeat(indent) + token;
      indent++;
    } else if (token.startsWith("<")) {
      formatted += "\n" + tab.repeat(indent) + token;
    } else {
      const text = token.trim();
      if (text) {
        formatted += "\n" + tab.repeat(indent) + text;
      }
    }
  }

  return formatted.trim();
}

function isVoidTag(tag: string): boolean {
  const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  const tagName = tag.replace(/<([a-z0-9]+).*/i, "$1").toLowerCase();
  return voidTags.includes(tagName);
}

export function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "") // Strip comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/>\s+</g, "><") // Remove space between tags
    .trim();
}

export function formatCSS(css: string): string {
  return css
    .replace(/\s*([\{\}:;,])\s*/g, "$1") // Clean around operators
    .replace(/;/g, ";\n  ")
    .replace(/\{/g, " {\n  ")
    .replace(/\}/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // Strip comments
    .replace(/\s*([\{\}:;,])\s*/g, "$1")
    .replace(/;\}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatJS(js: string): string {
  let indent = 0;
  const tab = "  ";
  const lines = js
    .replace(/([\{\}])/g, "\n$1\n")
    .replace(/;/g, ";\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let output = "";
  for (const line of lines) {
    if (line.startsWith("}")) indent = Math.max(0, indent - 1);
    output += tab.repeat(indent) + line + "\n";
    if (line.endsWith("{")) indent++;
  }
  return output.trim();
}

export interface RegexMatchResult {
  match: string;
  index: number;
  groups?: Record<string, string>;
}

export function testRegex(pattern: string, flags: string, testString: string): { matches: RegexMatchResult[]; isValid: boolean; error?: string } {
  try {
    const reg = new RegExp(pattern, flags);
    const matches: RegexMatchResult[] = [];
    let m: RegExpExecArray | null;

    if (!flags.includes("g")) {
      m = reg.exec(testString);
      if (m) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
      }
    } else {
      while ((m = reg.exec(testString)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
        if (m.index === reg.lastIndex) reg.lastIndex++; // Avoid infinite loop on zero-width match
      }
    }

    return { matches, isValid: true };
  } catch (err: unknown) {
    return { matches: [], isValid: false, error: (err as Error).message };
  }
}
