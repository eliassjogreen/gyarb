import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";
import {
  Literal,
  parseBooleanLiteral,
  parseNoneLiteral,
  parseNumberLiteral,
  parseStringLiteral,
} from "./literal.ts";
import {
  BinaryOperator,
  getBinaryOperator,
  isBinaryOperator,
  isUnaryOperator,
  parseBinaryOperator,
  parseUnaryOperator,
  UnaryOperator,
} from "./operator.ts";

export type Expression =
  | UnaryExpression
  | BinaryExpression
  | IfExpression
  | FunctionCall
  | VariableAccess
  | Grouping
  | Literal;

export const parseExpression: NodeParser<Expression> = (
  context: ParserContext,
) => {
  return parseExpressionWithPrecedence(context, -1);
};

export const parseExpressionWithPrecedence: NodeParser<Expression> = (
  context: ParserContext,
  precedence: number,
) => {
  let left: PrimaryExpression | UnaryExpression | BinaryExpression =
    parsePrimaryOrUnaryExpression(context);

  while (
    isBinaryOperator(context.current) &&
    getBinaryOperator(context.current).precedence > precedence
  ) {
    left = parseBinaryExpression(context, left);
  }

  return left;
};

export const parsePrimaryOrUnaryExpression: NodeParser<
  PrimaryExpression | UnaryExpression
> = (context: ParserContext) => {
  if (isUnaryOperator(context.current)) {
    return parseUnaryExpression(context);
  } else {
    return parsePrimaryExpression(context);
  }
};

export interface UnaryExpression extends
  Node<{
    operator: UnaryOperator;
    operand: Expression;
  }> {
  type: "unary_expression";
}

export const parseUnaryExpression: NodeParser<UnaryExpression> = (
  context: ParserContext,
) => {
  return {
    type: "unary_expression",
    value: {
      operator: parseUnaryOperator(context),
      operand: parsePrimaryOrUnaryExpression(context),
    },
  };
};

export interface BinaryExpression extends
  Node<{
    left: Expression;
    operator: BinaryOperator;
    right: Expression;
  }> {
  type: "binary_expression";
}

export const parseBinaryExpression: NodeParser<BinaryExpression> = (
  context: ParserContext,
  left: Expression,
) => {
  const operator = parseBinaryOperator(context);

  return {
    type: "binary_expression",
    value: {
      left,
      operator,
      right: parseExpressionWithPrecedence(context, operator.precedence),
    },
  };
};

export type PrimaryExpression =
  | Literal
  | FunctionCall
  | VariableAccess
  | Grouping;

export const parsePrimaryExpression: NodeParser<PrimaryExpression> = (
  context: ParserContext,
) => {
  switch (context.current.type) {
    case "boolean":
      return parseBooleanLiteral(context);
    case "number":
      return parseNumberLiteral(context);
    case "string":
      return parseStringLiteral(context);
    case "none":
      return parseNoneLiteral(context);
    case "identifier":
      if (context.is({ type: "left_parenthesis" }, context.next)) {
        return parseFunctionCall(context);
      } else {
        return parseVariableAccess(context);
      }
    case "left_parenthesis":
      return parseGrouping(context);
  }

  throw `Could not parse primary expression ${
    JSON.stringify(
      context.current,
    )
  }`;
};

export interface IfExpression extends
  Node<{
    condition: Expression;
    then: Expression;
    else: Expression;
  }> {
  type: "if_expression";
}

export const parseIfExpression: NodeParser<IfExpression> = (
  context: ParserContext,
) => {
  context.eat({ type: "if" });

  return {
    type: "if_expression",
    value: {
      condition: parseExpression(context),
      then: parseExpression(context),
      else: context.eat({ type: "else" }) &&
        parseExpression(context),
    },
  };
};

export interface FunctionCall extends
  Node<{
    name: string;
    parameters: Expression[];
  }> {
  type: "function_call";
}

export const parseFunctionCall: NodeParser<FunctionCall> = (
  context: ParserContext,
) => {
  return {
    type: "function_call",
    value: {
      name: context.eat({ type: "identifier" }).value as string,
      parameters: context.delimited(
        { type: "left_parenthesis" },
        { type: "right_parenthesis" },
        { type: "comma" },
        () => parseExpression(context),
      ),
    },
  };
};

export interface VariableAccess extends Node<string> {
  type: "variable_access";
}

export const parseVariableAccess: NodeParser<VariableAccess> = (
  context: ParserContext,
) => {
  return {
    type: "variable_access",
    value: context.eat({ type: "identifier" }).value as string,
  };
};

export interface Grouping extends Node<Expression> {
  type: "grouping";
}

export const parseGrouping: NodeParser<Grouping> = (context: ParserContext) => {
  context.eat({ type: "left_parenthesis" });

  const expression = parseExpression(context);

  context.eat({ type: "right_parenthesis" });

  return {
    type: "grouping",
    value: expression,
  };
};
