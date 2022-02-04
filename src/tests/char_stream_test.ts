import { CharStream } from "../core/char_stream.ts";
import { assert, assertEquals } from "./deps.ts";

Deno.test({
  name: "CharStream",
  async fn(context) {
    const stream1 = new CharStream("");
    const stream2 = new CharStream("Hello world");
    const stream3 = new CharStream("a");
    const stream4 = new CharStream("Testing abc123");

    await context.step("withinIndex", () => {
      assert(stream1.withinIndex(0));
      assert(!stream1.withinIndex(-1));
      assert(!stream1.withinIndex(1));
    });
  },
});
