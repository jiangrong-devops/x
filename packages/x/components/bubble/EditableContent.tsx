import type { PropType } from "vue";

import { Button, Flex } from "antdv-next";
import { defineComponent, nextTick, onMounted, ref, watch } from "vue";

import type { BubbleProps, EditableBubbleOption } from "./interface";

import { useLocale } from "../locale";
import enUS from "../locale/en_US";

function isBlock(el: HTMLElement): boolean {
  const display = getComputedStyle(el).display;
  return (
    display === "block" ||
    display === "flex" ||
    display === "list-item" ||
    display === "table"
  );
}

function getPlainTextWithFormat(dom: HTMLElement) {
  const lines: string[] = [""];
  const walker = document.createTreeWalker(
    dom,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );

  while (walker.nextNode()) {
    const node = walker.currentNode as HTMLElement;

    if (node.nodeType === Node.TEXT_NODE) {
      lines[lines.length - 1] += node.textContent ?? "";
      continue;
    }

    if (node.tagName === "BR" && node.parentNode?.childElementCount === 1) {
      continue;
    }

    if (node.tagName === "BR" || isBlock(node)) {
      lines.push("");
    }
  }

  return lines.join("\n");
}

export const EditableContent = defineComponent({
  name: "XBubbleEditableContent",
  props: {
    content: {
      type: String,
      required: true,
    },
    prefixCls: {
      type: String,
      required: true,
    },
    okText: {
      type: [String, Object] as PropType<EditableBubbleOption["okText"]>,
      default: undefined,
    },
    cancelText: {
      type: [String, Object] as PropType<EditableBubbleOption["cancelText"]>,
      default: undefined,
    },
    onEditConfirm: {
      type: Function as PropType<BubbleProps["onEditConfirm"]>,
      default: undefined,
    },
    onEditCancel: {
      type: Function as PropType<BubbleProps["onEditCancel"]>,
      default: undefined,
    },
  },
  setup(props) {
    const editableRef = ref<HTMLDivElement>();
    const [contextLocale] = useLocale("Bubble", enUS.Bubble);

    const placeCaretAtEnd = () => {
      const editable = editableRef.value;
      if (!editable || typeof window === "undefined") return;

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    watch(
      () => props.content,
      value => {
        if (!editableRef.value) return;
        editableRef.value.textContent = value;
      },
    );

    onMounted(() => {
      if (!editableRef.value) return;
      editableRef.value.textContent = props.content;
      void nextTick(() => {
        editableRef.value?.focus();
        placeCaretAtEnd();
      });
    });

    const confirm = () => {
      const editable = editableRef.value;
      props.onEditConfirm?.(
        editable ? getPlainTextWithFormat(editable) : props.content,
      );
    };

    const cancel = () => {
      props.onEditCancel?.();
    };

    return () => (
      <>
        <div ref={editableRef} contenteditable />
        <Flex class={`${props.prefixCls}-editing-opts`} gap={8}>
          <Button type="primary" shape="round" size="small" onClick={confirm}>
            {props.okText ?? contextLocale.value.editableOk}
          </Button>
          <Button type="text" shape="round" size="small" onClick={cancel}>
            {props.cancelText ?? contextLocale.value.editableCancel}
          </Button>
        </Flex>
      </>
    );
  },
});
