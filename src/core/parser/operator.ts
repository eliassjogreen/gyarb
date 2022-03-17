import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";
import { Token } from "../tokenizer.ts";

// TODO: Add binary associativity and unary notation
// export enum Associativity {
//   left,
//   none,
//   right,
// }
// export enum Notation {
//   prefix,
//   postfix,
// }

export type Operator = UnaryOperator | BinaryOperator;

export type UnaryOperator =
  | PositiveOperator
  | NegativeOperator
  | LogicalNotOperator;

export interface PositiveOperator extends Node {
  type: "positive_operator";
  value: "+";
}

export interface NegativeOperator extends Node {
  type: "negative_operator";
  value: "-";
}

export interface LogicalNotOperator extends Node {
  type: "logical_not_operator";
  value: "!";
}

export const parseUnaryOperator: NodeParser<UnaryOperator> = (
  context: ParserContext,
) => {
  switch (context.advance().type) {
    case "plus":
      return { type: "positive_operator", value: "+" };
    case "minus":
      return { type: "negative_operator", value: "-" };
    case "logical_not":
      return { type: "logical_not_operator", value: "!" };
    default:
      throw `Unknown unary operator "${context.next.type}"`;
  }
};

export const isUnaryOperator = (token: Token): boolean => {
  return token.type === "plus" || token.type === "minus" ||
    token.type === "logical_not";
};

export type BinaryOperator =
  | AssignmentOperator
  | AdditionOperator
  | SubtractionOperator
  | MultiplicationOperator
  | DivisionOperator
  | ModuloOperator
  | EqualityOperator
  | InequalityOperator
  | LessThanOperator
  | GreaterThanOperator
  | LessThanEqualOperator
  | GreaterThanEqualOperator
  | LogicalOrOperator
  | LogicalAndOperator;

export const parseBinaryOperator: NodeParser<BinaryOperator> = (
  context: ParserContext,
) => {
  return getBinaryOperator(context.advance());
};

export const getBinaryOperator = (token: Token): BinaryOperator => {
  switch (token.type) {
    case "assignment":
      return { type: "assignment_operator", precedence: 5, value: "=" };
    case "addition":
      return { type: "addition_operator", precedence: 2, value: "+" };
    case "subtraction":
      return { type: "subtraction_operator", precedence: 2, value: "-" };
    case "multiplication":
      return {
        type: "multiplication_operator",
        precedence: 3,
        value: "*",
      };
    case "division":
      return { type: "division_operator", precedence: 3, value: "/" };
    case "modulo":
      return { type: "modulo_operator", precedence: 3, value: "%" };
    case "equality":
      return { type: "equality_operator", precedence: 0, value: "===" };
    case "inequality":
      return { type: "inequality_operator", precedence: 0, value: "!==" };
    case "less_than":
      return { type: "less_than_operator", precedence: 1, value: "<" };
    case "greater_than":
      return { type: "greater_than_operator", precedence: 1, value: ">" };
    case "less_than_equal":
      return {
        type: "less_than_equal_operator",
        precedence: 1,
        value: "<=",
      };
    case "greater_than_equal":
      return {
        type: "greater_than_equal_operator",
        precedence: 1,
        value: ">=",
      };
    case "logical_or":
      return { type: "logical_or_operator", precedence: 4, value: "||" };
    case "logical_and":
      return { type: "logical_and_operator", precedence: 4, value: "&&" };
    default:
      throw `Unknown binary operator "${token.type}"`;
  }
};

export const isBinaryOperator = (token: Token): boolean => {
  return token.type === "assignment" ||
    token.type === "addition" ||
    token.type === "subtraction" ||
    token.type === "multiplication" ||
    token.type === "division" ||
    token.type === "modulo" ||
    token.type === "equality" ||
    token.type === "inequality" ||
    token.type === "less_than" ||
    token.type === "greater_than" ||
    token.type === "less_than_equal" ||
    token.type === "greater_than_equal" ||
    token.type === "logical_or" ||
    token.type === "logical_and";
};

export interface BinaryOperatorNode extends Node {
  precedence: number;
}

export interface AssignmentOperator extends BinaryOperatorNode {
  type: "assignment_operator";
  precedence: 5;
  value: "=";
}

export interface AdditionOperator extends BinaryOperatorNode {
  type: "addition_operator";
  precedence: 2;
  value: "+";
}

export interface SubtractionOperator extends BinaryOperatorNode {
  type: "subtraction_operator";
  precedence: 2;
  value: "-";
}

export interface MultiplicationOperator extends BinaryOperatorNode {
  type: "multiplication_operator";
  precedence: 3;
  value: "*";
}

export interface DivisionOperator extends BinaryOperatorNode {
  type: "division_operator";
  precedence: 3;
  value: "/";
}

export interface ModuloOperator extends BinaryOperatorNode {
  type: "modulo_operator";
  precedence: 3;
  value: "%";
}

export interface EqualityOperator extends BinaryOperatorNode {
  type: "equality_operator";
  precedence: 0;
  value: "===";
}

export interface InequalityOperator extends BinaryOperatorNode {
  type: "inequality_operator";
  precedence: 0;
  value: "!==";
}

export interface LessThanOperator extends BinaryOperatorNode {
  type: "less_than_operator";
  precedence: 1;
  value: "<";
}

export interface GreaterThanOperator extends BinaryOperatorNode {
  type: "greater_than_operator";
  precedence: 1;
  value: ">";
}

export interface LessThanEqualOperator extends BinaryOperatorNode {
  type: "less_than_equal_operator";
  precedence: 1;
  value: "<=";
}

export interface GreaterThanEqualOperator extends BinaryOperatorNode {
  type: "greater_than_equal_operator";
  precedence: 1;
  value: ">=";
}

export interface LogicalOrOperator extends BinaryOperatorNode {
  type: "logical_or_operator";
  precedence: 4;
  value: "||";
}

export interface LogicalAndOperator extends BinaryOperatorNode {
  type: "logical_and_operator";
  precedence: 4;
  value: "&&";
}
