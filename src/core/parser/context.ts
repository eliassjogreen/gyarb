import { Token } from "../tokenizer.ts";

export class ParserContext {
  #tokens: Token[];
  #index: number;

  get current(): Token {
    return this.#tokens[this.#index];
  }

  get next(): Token {
    return this.#tokens[this.#index + 1];
  }

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
    this.#index = 0;
  }

  at(index: number): Token {
    return this.#tokens[index];
  }

  offset(offset: number): Token {
    return this.#tokens[this.#index + offset];
  }

  advance(steps = 1): Token {
    this.#index += steps;
    return this.offset(-steps);
  }

  eat(
    { value, type }: { value?: string; type?: string },
    token: Token = this.current,
  ): Token {
    if (!token) {
      throw `Unexpected empty token`;
    }

    if (type && value) {
      if (token.type !== type && token.value !== value) {
        throw `Expected type "${type}" with value "${value}" but recieved type "${token.type}" with value "${token.value}" at index ${token.location.start}`;
      }

      if (token.type !== type) {
        throw `Expected type "${type}" but recieved type "${token.type}" at index ${token.location.start}`;
      }

      if (token.value !== value) {
        throw `Expected value "${value}" but recieved "${token.value}" at index ${token.location.start}`;
      }
    } else {
      if (type) {
        if (token.type !== type) {
          throw `Expected type "${type}" but recieved type "${token.type}" at index ${token.location.start}`;
        }
      }
      if (value) {
        if (token.value !== value) {
          throw `Expected value "${value}" but recieved value "${token.value}" at index ${token.location.start}`;
        }
      }
    }

    return this.advance();
  }

  is(
    { value, type }: { value?: string; type?: string },
    token: Token = this.current,
  ): boolean {
    if (!token) {
      throw `Unexpected empty token`;
    }

    if (type && value) {
      return token.type === type && token.value === value;
    } else {
      if (type) {
        return token.type === type;
      }

      if (value) {
        return token.value === value;
      }
    }

    return false;
  }

  delimited<T>(
    start: { value?: string; type?: string },
    stop: { value?: string; type?: string },
    separator: { value?: string; type?: string },
    parser: () => T,
  ): T[] {
    const nodes = [];

    this.eat(start);

    while (!this.is(stop)) {
      nodes.push(parser());
      if (!this.is(stop)) {
        this.eat(separator);
      }
    }

    this.eat(stop);

    return nodes;
  }

  until<T>(
    stop: { value?: string; type?: string },
    separator: { value?: string; type?: string },
    parser: () => T,
  ): T[] {
    const nodes = [];

    while (!this.is(stop)) {
      nodes.push(parser());
      if (!this.is(stop)) {
        this.eat(separator);
      }
    }

    this.eat(stop);

    return nodes;
  }
}
