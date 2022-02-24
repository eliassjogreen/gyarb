import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";
import { Macro, parseMacro } from "./macro.ts";
import { Block, parseBlock } from "./program.ts";
import { Expression, parseExpression } from "./expression.ts";

export type Statement =
  | IfStatement
  | WhileStatement
  | ReturnStatement
  | ContinueStatement
  | BreakStatement
  | VariableDeclaration
  | ConstantDeclaration
  | ExpressionStatement
  | Block
  | Macro;

export const parseStatement: NodeParser<Statement> = (
  context: ParserContext,
) => {
  switch (context.current.type) {
    case "macro":
      return parseMacro(context);
    case "if":
      return parseIfStatement(context);
    case "return":
      return parseReturnStatement(context);
    case "variable":
      return parseVariableDeclaration(context);
    case "constant":
      return parseConstantDeclaration(context);
    case "while":
      return parseWhileStatement(context);
    case "continue":
      return parseContinueStatement(context);
    case "break":
      return parseBreakStatement(context);
    case "left_brace":
      return parseBlock(context);
    default:
      return parseExpressionStatement(context);
  }
};

export interface ReturnStatement extends Node<Expression> {
  type: "return_statement";
}

export const parseReturnStatement: NodeParser<ReturnStatement> = (
  context: ParserContext,
) => {
  context.eat({ type: "return" });

  return {
    type: "return_statement",
    value: parseExpression(context),
  };
};

export interface ContinueStatement extends Node<undefined> {
  type: "continue_statement";
}

export const parseContinueStatement: NodeParser<ContinueStatement> = (
  context: ParserContext,
) => {
  context.eat({ type: "continue" });

  return {
    type: "continue_statement",
    value: undefined,
  };
};

export interface BreakStatement extends Node<undefined> {
  type: "break_statement";
}

export const parseBreakStatement: NodeParser<BreakStatement> = (
  context: ParserContext,
) => {
  context.eat({ type: "break" });

  return {
    type: "break_statement",
    value: undefined,
  };
};

export interface IfStatement extends
  Node<{
    condition: Expression;
    then: Statement;
    else?: Statement;
  }> {
  type: "if_statement";
}

export const parseIfStatement: NodeParser<IfStatement> = (
  context: ParserContext,
) => {
  context.eat({ type: "if" });

  return {
    type: "if_statement",
    value: {
      condition: parseExpression(context),
      then: parseStatement(context),
      else: context.is({ type: "else" })
        ? context.eat({ type: "else" }) &&
          parseStatement(context)
        : undefined,
    },
  };
};

export interface WhileStatement extends
  Node<{
    condition: Expression;
    then: Statement;
  }> {
  type: "while_statement";
}

export const parseWhileStatement: NodeParser<WhileStatement> = (
  context: ParserContext,
) => {
  context.eat({ type: "while" });

  return {
    type: "while_statement",
    value: {
      condition: parseExpression(context),
      then: parseStatement(context),
    },
  };
};

export interface VariableDeclaration extends
  Node<{
    name: string;
    value: Expression;
  }> {
  type: "variable_declaration";
}

export const parseVariableDeclaration: NodeParser<VariableDeclaration> = (
  context: ParserContext,
) => {
  context.eat({ type: "variable" });
  const name = context.eat({ type: "identifier" }).value as string;

  context.eat({ type: "assignment" });
  const value = parseExpression(context);

  return {
    type: "variable_declaration",
    value: {
      name,
      value,
    },
  };
};

export interface ConstantDeclaration extends
  Node<{
    name: string;
    value: Expression;
  }> {
  type: "constant_declaration";
}

export const parseConstantDeclaration: NodeParser<ConstantDeclaration> = (
  context: ParserContext,
) => {
  context.eat({ type: "constant" });
  const name = context.eat({ type: "identifier" }).value as string;

  context.eat({ type: "assignment" });
  const value = parseExpression(context);

  return {
    type: "constant_declaration",
    value: {
      name,
      value,
    },
  };
};

export interface ExpressionStatement extends Node<Expression> {
  type: "expression_statement";
}

export const parseExpressionStatement: NodeParser<ExpressionStatement> = (
  context: ParserContext,
) => {
  return {
    type: "expression_statement",
    value: parseExpression(context),
  };
};
