import { ParserContext } from "./context.ts";

export interface Node<T = unknown> {
  type: string;
  value: T;
}

export type NodeParser<T extends Node> = (
  context: ParserContext,
  // deno-lint-ignore no-explicit-any
  ...params: any[]
) => T;
