/** Represents a pattern to be scanned for in the Tokenizer */
export type Pattern =
  | ((text: string) => string | undefined)
  | ((text: string) => string | undefined)[]
  | RegExp
  | RegExp[]
  | string
  | string[];

/** Represents a Rule to be scanned for in the Tokenizer */
export interface Rule<T = unknown> {
  type: string | number;
  pattern: Pattern;
  value?: ((match: { match: string; groups: string[] }) => T) | T;
  ignore?: boolean;
}

/** Represents the Token that will be return on a match when scanning in the Tokenizer */
export interface Token<T = unknown> {
  type: string | number;
  match: string;
  groups: string[];
  value: T;
  location: {
    start: number;
    end: number;
  };
}

export class TokenizerSource {
  /** The current index of the TokenizerSource in the source string */
  index = 0;

  /** The string that will be scanned */
  source: string;

  unexpectedCharacterError: () => never = () => {
    throw `Unexpected character: "${
      this.source[this.index]
    }" at index ${this.index}`;
  };
  /** Checks if the TokenizerSource is done scanning the source string */
  get done(): boolean {
    return !(this.index < this.source.length);
  }

  constructor(source: string) {
    this.source = source;
  }
}

/** Tokenizes given source string into tokens */
export class Tokenizer {
  /** The rules that tells the Tokenizer what patterns to look for */
  rules: Rule[];

  /** Constructs a new Tokenizer */
  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  /** Tokenizes source to a Token array */
  *tokenize(source: string | TokenizerSource): IterableIterator<Token> {
    source = typeof source === "string" ? new TokenizerSource(source) : source;

    while (!source.done) {
      const token = this.next(source);

      if (!source.done) {
        yield token.value;
      }
    }
  }

  /** Returns the next scanned Token */
  next(source: TokenizerSource): IteratorResult<Token> {
    if (source.done) {
      return {
        done: true,
        value: undefined,
      };
    }

    const token = this.#scan(source);

    if (token) {
      return {
        done: false,
        value: token,
      };
    }

    if (source.done) {
      return {
        done: true,
        value: undefined,
      };
    }

    source.unexpectedCharacterError();
  }

  #scan(source: TokenizerSource): Token | undefined {
    if (source.done) {
      return;
    } else {
      for (const rule of this.rules) {
        const start = source.index;
        const result = this.#match(
          source,
          source.source.substring(source.index),
          rule.pattern,
        );
        const end = source.index;

        if (result) {
          if (rule.ignore || rule.type === "") {
            return this.#scan(source);
          } else {
            return {
              type: rule.type,
              match: result.match,
              value: rule.value
                ? typeof rule.value === "function"
                  ? rule.value(result)
                  : rule.value
                : result.match,
              groups: result.groups,
              location: {
                start: start,
                end: end,
              },
            };
          }
        }
      }
    }
  }

  #match(
    source: TokenizerSource,
    text: string,
    pattern: Pattern,
    increment = true,
  ): { match: string; groups: string[] } | undefined {
    let result: { match: string; groups: string[] } | undefined;

    if (typeof pattern === "function") {
      const matched = pattern(text);

      result = matched ? { match: matched, groups: [] } : undefined;
    } else if (typeof pattern === "string") {
      result = text.startsWith(pattern)
        ? { match: pattern, groups: [] }
        : undefined;
    } else if (pattern instanceof RegExp) {
      const matched = text.match(pattern);

      if (matched && matched.index === 0) {
        result = {
          match: matched[0],
          groups: matched.length > 1 ? matched.slice(1) : [],
        };
      }
    } else if (pattern instanceof Array) {
      for (const p of pattern) {
        result = this.#match(source, text, p, false);

        if (result) break;
      }
    }

    if (result && increment) source.index += result.match.length;
    return result;
  }
}
