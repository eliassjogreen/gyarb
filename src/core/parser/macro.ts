import { Node, NodeParser } from "./node.ts";
import { ParserContext } from "./context.ts";

export interface Macro extends Node<{ type: string; value: string }> {
  type: "macro";
}

export const parseMacro: NodeParser<Macro> = (
  context: ParserContext,
) => {
  const { type, value } = context.eat({ type: "macro" }).value as {
    type: string;
    value: string;
  };

  return {
    type: "macro",
    value: {
      type,
      value,
    },
  };
};
