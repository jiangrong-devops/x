import { mount, VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { h } from "vue";

import Conversations from "../index";

const items = [
  {
    key: "demo1",
    label: "What is Ant Design X ?",
    icon: h("div", { class: "conversation-icon" }, "icon"),
    group: "pinned",
  },
  {
    key: "demo2",
    label: "Getting Started",
  },
  {
    key: "demo4",
    label: "In Docker, use Ollama and initialize",
  },
  {
    key: "demo5",
    label: "Expired, please go to the recycle bin to check",
    disabled: true,
  },
] as const;

const wrappers: VueWrapper[] = [];

function track<T extends VueWrapper>(wrapper: T): T {
  wrappers.push(wrapper);
  return wrapper;
}

function dispatchKeyboardEvent(
  type: "keydown" | "keyup",
  init: KeyboardEventInit & { keyCode: number },
) {
  const event = new KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init,
  });

  Object.defineProperty(event, "keyCode", {
    configurable: true,
    get: () => init.keyCode,
  });

  document.dispatchEvent(event);
}

function waitMotionEnd(timeout = 520) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
});

describe("Conversations", () => {
  it("supports expose ref", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
        },
      }),
    );

    expect((wrapper.vm as any).nativeElement).toBeInstanceOf(HTMLUListElement);
  });

  it("handles defaultActiveKey", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          defaultActiveKey: "demo1",
        },
      }),
    );

    const active = wrapper.find(".antd-conversations-item-active");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("What is Ant Design X ?");
  });

  it("handles controlled activeKey", async () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          activeKey: "demo1",
        },
      }),
    );

    expect(wrapper.find(".antd-conversations-item-active").text()).toContain(
      "What is Ant Design X ?",
    );

    await wrapper.setProps({ activeKey: "demo4" });
    expect(wrapper.find(".antd-conversations-item-active").text()).toContain(
      "In Docker, use Ollama and initialize",
    );
  });

  it("triggers onActiveChange and ignores disabled item click", async () => {
    const onActiveChange = vi.fn();

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          onActiveChange,
        },
      }),
    );

    const listItems = wrapper.findAll(".antd-conversations-item");

    await listItems[0]!.trigger("click");
    expect(onActiveChange).toHaveBeenCalledWith(
      "demo1",
      expect.objectContaining({
        key: "demo1",
        label: "What is Ant Design X ?",
      }),
    );

    await listItems[3]!.trigger("click");
    expect(onActiveChange).toHaveBeenCalledTimes(1);
  });

  it("renders menu icon and calls menu function", () => {
    const menu = vi.fn().mockReturnValue({
      items: [
        { label: "Rename", key: "rename" },
        { label: "Delete", key: "delete" },
      ],
    });

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          menu,
        },
      }),
    );

    expect(menu).toHaveBeenCalled();
    expect(wrapper.find(".antd-conversations-menu-icon").exists()).toBe(true);
  });

  it("supports custom menu trigger node", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          menu: {
            trigger: h("span", { class: "menu-trigger-node" }, "trigger-node"),
            items: [],
          },
        },
      }),
    );

    expect(wrapper.find(".menu-trigger-node").exists()).toBe(true);
    expect(wrapper.find(".antd-conversations-menu-icon").exists()).toBe(false);
  });

  it("supports custom menu trigger function", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          menu: {
            trigger: (conversation: any) =>
              h(
                "span",
                { class: "menu-trigger-fn" },
                `trigger-${conversation.key}`,
              ),
            items: [],
          },
        },
      }),
    );

    expect(wrapper.find(".menu-trigger-fn").exists()).toBe(true);
    expect(wrapper.find(".antd-conversations-menu-icon").exists()).toBe(false);
  });

  it("supports labelRender and iconRender props", () => {
    const labelRender = vi.fn((item: any, info: any) =>
      h(
        "span",
        `${item.key}-${info.index}-${info.active ? "active" : "inactive"}`,
      ),
    );
    const iconRender = vi.fn((item: any, info: any) =>
      h("span", `icon-${item.key}-${info.index}`),
    );

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          defaultActiveKey: "demo1",
          labelRender,
          iconRender,
        },
      }),
    );

    expect(labelRender).toHaveBeenCalled();
    expect(iconRender).toHaveBeenCalled();
    expect(wrapper.text()).toContain("demo1-0-active");
    expect(wrapper.text()).toContain("icon-demo1-0");

    const [firstItem, firstInfo] = labelRender.mock.calls[0]!;
    expect(firstItem).toEqual(expect.objectContaining({ key: "demo1" }));
    expect(firstInfo).toEqual(
      expect.objectContaining({
        item: expect.objectContaining({ key: "demo1" }),
        index: 0,
        active: true,
        originNode: "What is Ant Design X ?",
      }),
    );
  });

  it("prefers labelRender and iconRender slots over props", () => {
    const labelRender = vi.fn();
    const iconRender = vi.fn();

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          labelRender,
          iconRender,
        },
        slots: {
          labelRender: ({ item, index }: any) =>
            h("span", `slot-${item.key}-${index}`),
          iconRender: ({ item, index }: any) =>
            h("span", `slot-icon-${item.key}-${index}`),
        },
      }),
    );

    expect(wrapper.text()).toContain("slot-demo1-0");
    expect(wrapper.text()).toContain("slot-icon-demo1-0");
    expect(labelRender).not.toHaveBeenCalled();
    expect(iconRender).not.toHaveBeenCalled();
  });

  it("falls back to item label and icon when no render is provided", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
        },
      }),
    );

    expect(wrapper.text()).toContain("What is Ant Design X ?");
    expect(wrapper.find(".conversation-icon").exists()).toBe(true);
  });

  it("treats empty render result as explicit and does not fallback", () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          labelRender: () => null,
          iconRender: () => null,
        },
      }),
    );

    expect(wrapper.find(".conversation-icon").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("What is Ant Design X ?");
  });

  it("supports grouping and custom group label", () => {
    const grouped = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: true,
        },
      }),
    );

    expect(grouped.text()).toContain("pinned");

    const customLabel = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: {
            label: group =>
              h("div", { class: "custom-group-label" }, `group-${group}`),
          },
        },
      }),
    );

    expect(customLabel.find(".custom-group-label").text()).toContain(
      "group-pinned",
    );

    const noGroup = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: false,
        },
      }),
    );

    expect(noGroup.text()).not.toContain("group-pinned");
  });

  it("prefers groupLabelRender slot over prop", () => {
    const groupLabelRender = vi.fn();

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: {
            label: group => `group-${group}`,
          },
          groupLabelRender,
        },
        slots: {
          groupLabelRender: ({ group, originNode }: any) =>
            h("span", { class: "group-slot-label" }, `${group}-${originNode}`),
        },
      }),
    );

    expect(wrapper.find(".group-slot-label").text()).toBe(
      "pinned-group-pinned",
    );
    expect(groupLabelRender).not.toHaveBeenCalled();
  });

  it("supports groupLabelRender prop", () => {
    const groupLabelRender = vi.fn((group: string, info: any) =>
      h("span", { class: "group-prop-label" }, `${group}-${info.originNode}`),
    );

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: {
            label: group => `group-${group}`,
          },
          groupLabelRender,
        },
      }),
    );

    expect(wrapper.find(".group-prop-label").text()).toBe(
      "pinned-group-pinned",
    );
    expect(groupLabelRender).toHaveBeenCalledWith(
      "pinned",
      expect.objectContaining({
        group: "pinned",
        groupInfo: expect.objectContaining({ name: "pinned" }),
        originNode: "group-pinned",
      }),
    );
  });

  it("supports collapsible groups", async () => {
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: {
            collapsible: true,
            defaultExpandedKeys: ["pinned"],
          },
        },
      }),
    );

    expect(wrapper.find(".antd-conversations-content-hidden").exists()).toBe(
      false,
    );

    await wrapper.find(".antd-conversations-group-title").trigger("click");
    await waitMotionEnd();
    expect(wrapper.findAll(".antd-conversations-item")).toHaveLength(3);
  });

  it("supports controlled expandedKeys", async () => {
    const onExpand = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          groupable: {
            collapsible: true,
            expandedKeys: ["pinned"],
            onExpand,
          },
        },
      }),
    );

    expect(wrapper.find(".antd-conversations-content-hidden").exists()).toBe(
      false,
    );

    await wrapper.find(".antd-conversations-group-title").trigger("click");
    expect(onExpand).toHaveBeenCalledWith([]);
    expect(wrapper.findAll(".antd-conversations-item")).toHaveLength(4);

    await wrapper.setProps({
      groupable: {
        collapsible: true,
        expandedKeys: [],
        onExpand,
      },
    });

    await waitMotionEnd();
    expect(wrapper.findAll(".antd-conversations-item")).toHaveLength(3);
  });

  it("supports creation click and disabled state", async () => {
    const onClick = vi.fn();

    const wrapper = track(
      mount(Conversations, {
        props: {
          items: [...items],
          creation: {
            onClick,
          },
        },
      }),
    );

    const creationButton = wrapper.get(".antd-conversations-creation");
    expect(creationButton.text()).toContain("New chat");

    await creationButton.trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);

    await wrapper.setProps({
      creation: {
        onClick,
        disabled: true,
      },
    });

    await wrapper.get(".antd-conversations-creation").trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports shortcut keys for items", async () => {
    const onActiveChange = vi.fn();

    track(
      mount(Conversations, {
        props: {
          items: [...items],
          onActiveChange,
          defaultActiveKey: "demo1",
          shortcutKeys: {
            items: ["Alt", "number"],
          },
        },
      }),
    );

    dispatchKeyboardEvent("keydown", {
      key: "3",
      code: "Digit3",
      altKey: true,
      keyCode: 51,
    });
    dispatchKeyboardEvent("keyup", {
      key: "3",
      code: "Digit3",
      altKey: true,
      keyCode: 51,
    });

    expect(onActiveChange).toHaveBeenCalledWith(
      "demo4",
      expect.objectContaining({ key: "demo4" }),
    );
  });

  it("supports shortcut keys for fixed item list", () => {
    const onActiveChange = vi.fn();

    track(
      mount(Conversations, {
        props: {
          items: [...items],
          onActiveChange,
          defaultActiveKey: "demo1",
          shortcutKeys: {
            items: [
              ["Alt", 49],
              ["Alt", 50],
              ["Alt", 51],
            ],
          },
        },
      }),
    );

    dispatchKeyboardEvent("keydown", {
      key: "3",
      code: "Digit3",
      altKey: true,
      keyCode: 51,
    });
    dispatchKeyboardEvent("keyup", {
      key: "3",
      code: "Digit3",
      altKey: true,
      keyCode: 51,
    });

    expect(onActiveChange).toHaveBeenCalledWith(
      "demo4",
      expect.objectContaining({ key: "demo4" }),
    );
  });

  it("supports shortcut key for creation", () => {
    const onClick = vi.fn();

    track(
      mount(Conversations, {
        props: {
          items: [...items],
          shortcutKeys: {
            creation: ["Meta", 75],
          },
          creation: {
            onClick,
          },
        },
      }),
    );

    dispatchKeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      metaKey: true,
      keyCode: 75,
    });
    dispatchKeyboardEvent("keyup", {
      key: "k",
      code: "KeyK",
      metaKey: true,
      keyCode: 75,
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
