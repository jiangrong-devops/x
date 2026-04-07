import type { VNodeChild } from "vue";

import { Comment, Fragment, isVNode } from "vue";

export function isEmptyNode(node: unknown): boolean {
  if (node === null || node === undefined || typeof node === "boolean")
    return true;

  if (Array.isArray(node)) return node.every(isEmptyNode);

  if (isVNode(node)) {
    if (node.type === Comment) return true;

    if (node.type === Fragment && Array.isArray(node.children)) {
      return node.children.every(child => isEmptyNode(child as VNodeChild));
    }
  }

  return false;
}

export function hasRenderableNode(node: unknown): boolean {
  return !isEmptyNode(node);
}
