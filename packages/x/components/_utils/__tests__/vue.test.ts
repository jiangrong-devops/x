import { describe, expect, it } from "vite-plus/test";
import { createCommentVNode, Fragment, h } from "vue";

import { hasRenderableNode, isEmptyNode } from "../vue";

describe("vue utils", () => {
  it("detects empty Vue nodes", () => {
    expect(isEmptyNode(null)).toBe(true);
    expect(isEmptyNode(undefined)).toBe(true);
    expect(isEmptyNode(false)).toBe(true);
    expect(isEmptyNode([null, undefined, false])).toBe(true);
    expect(isEmptyNode(createCommentVNode())).toBe(true);
    expect(isEmptyNode(h(Fragment, null, [createCommentVNode()]))).toBe(true);
  });

  it("detects renderable Vue nodes", () => {
    expect(hasRenderableNode("")).toBe(true);
    expect(hasRenderableNode(0)).toBe(true);
    expect(hasRenderableNode(h("span"))).toBe(true);
    expect(hasRenderableNode([createCommentVNode(), h("span")])).toBe(true);
  });
});
