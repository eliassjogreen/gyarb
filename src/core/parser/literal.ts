import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";

export type Literal =
  | BooleanLiteral
  | NumberLiteral
  | StringLiteral
  | NoneLiteral;

export interface BooleanLiteral extends Node<boolean> {
  type: "boolean_literal";
}

export const parseBooleanLiteral: NodeParser<BooleanLiteral> = (
  context: ParserContext,
) => {
  return {
    type: "boolean_literal",
    value: context.eat({ type: "boolean" }).value as boolean,
  };
};

export interface NumberLiteral extends Node<number> {
  type: "number_literal";
}

export const parseNumberLiteral: NodeParser<NumberLiteral> = (
  context: ParserContext,
) => {
  return {
    type: "number_literal",
    value: context.eat({ type: "number" }).value as number,
  };
};

export interface StringLiteral extends Node<string> {
  type: "string_literal";
}

export const parseStringLiteral: NodeParser<StringLiteral> = (
  context: ParserContext,
) => {
  return {
    type: "string_literal",
    value: context.eat({ type: "string" }).value as string,
  };
};

export interface NoneLiteral extends Node<undefined> {
  type: "none_literal";
}

export const parseNoneLiteral: NodeParser<NoneLiteral> = (
  context: ParserContext,
) => {
  context.eat({ type: "none" });
  return {
    type: "none_literal",
    value: undefined,
  };
};
