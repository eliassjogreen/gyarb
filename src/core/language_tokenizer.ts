import { LanguageDefinition } from "./language_definition.ts";
import { Tokenizer } from "./tokenizer.ts";

export class LanguageTokenizer extends Tokenizer {
  constructor(language: LanguageDefinition) {
    super([
      { type: "whitespace", pattern: /\s+/, ignore: true },
      { type: "comment", pattern: /\/\/.*/, ignore: true },
      { type: "comment", pattern: /\/\*[.\n]*\*\//, ignore: true },

      { type: "import", pattern: language.keywords.import },
      { type: "from", pattern: language.keywords.from },
      { type: "export", pattern: language.keywords.export },
      { type: "function", pattern: language.keywords.function },
      { type: "return", pattern: language.keywords.return },
      { type: "if", pattern: language.keywords.if },
      { type: "while", pattern: language.keywords.while },
      { type: "break", pattern: language.keywords.break },
      { type: "continue", pattern: language.keywords.continue },
      { type: "var", pattern: language.keywords.var },
      { type: "val", pattern: language.keywords.val },

      {
        type: "boolean",
        pattern: [language.boolean.true, language.boolean.false],
        value: (m: { match: string }) => m.match === language.boolean.true,
      },
      {
        type: "number",
        pattern: /[\-\+]?[0-9]*(\.[0-9]+)?/,
        value: (m: { match: string }) => parseFloat(m.match),
      },
      {
        type: "string",
        pattern: /"(.*?[^\\])"/,
        value: (m: { groups: string[] }) => m.groups[0],
      },

      { type: "identifier", pattern: /\p{L}+/u },

      {
        type: "macro",
        pattern: /#\[([^\]]*)\]\s*{((?:[^}]|})*)}/,
      },
      {
        type: "macro",
        pattern: /#\[([^\]]*)\]\s*(.*)/,
      },

      { type: "left_parenthesis", pattern: "(" },
      { type: "right_parenthesis", pattern: ")" },
      { type: "left_brace", pattern: "{" },
      { type: "right_brace", pattern: "}" },
      { type: "comma", pattern: "," },
      { type: "colon", pattern: ":" },

      { type: "assign", pattern: "=" },

      { type: "plus", pattern: "+" },
      { type: "minus", pattern: "-" },
      { type: "multiply", pattern: "*" },
      { type: "divide", pattern: "/" },
      { type: "modulo", pattern: "%" },

      { type: "equality", pattern: "==" },
      { type: "inequality", pattern: "!=" },
      { type: "less_than", pattern: "<" },
      { type: "less_than_equal", pattern: "<=" },
      { type: "greater_than", pattern: ">" },
      { type: "greater_than_equal", pattern: ">=" },

      { type: "logical_or", pattern: "||" },
      { type: "logical_and", pattern: "&&" },
    ]);
  }
}
