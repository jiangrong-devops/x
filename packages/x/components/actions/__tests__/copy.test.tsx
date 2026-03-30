import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vite-plus/test";
import { nextTick } from "vue";

import ActionsCopy from "../ActionsCopy";

describe("ActionsCopy", () => {
  it("renders with text", () => {
    const wrapper = mount(ActionsCopy, {
      props: {
        text: "hello",
      },
    });

    expect(wrapper.find(".antd-actions-copy").exists()).toBe(true);
  });

  it("renders with no text", () => {
    const wrapper = mount(ActionsCopy);
    expect(wrapper.find(".antd-actions-copy").exists()).toBe(true);
  });

  it("accepts icon prop", () => {
    const wrapper = mount(ActionsCopy, {
      props: {
        text: "copy",
        icon: <span class="copy-icon">copy-icon</span>,
      },
    });

    expect(wrapper.find(".antd-actions-copy").exists()).toBe(true);
  });

  it("supports custom class and prefixCls", () => {
    const wrapper = mount(ActionsCopy, {
      props: {
        text: "test",
        class: "my-class",
        prefixCls: "my-prefix",
      },
    });

    expect(wrapper.find(".my-class").exists()).toBe(true);
    expect(wrapper.find(".my-prefix-copy").exists()).toBe(true);
  });

  it("supports rootClass", () => {
    const wrapper = mount(ActionsCopy, {
      props: {
        text: "test",
        rootClass: "root-class",
      },
    });

    expect(wrapper.find(".root-class").exists()).toBe(true);
  });

  it("supports iconRender slot", () => {
    const wrapper = mount(ActionsCopy, {
      props: {
        text: "copy",
        icon: <span class="copy-icon">copy-icon</span>,
      },
      slots: {
        iconRender: ({ originNode }: any) => (
          <span class="slot-copy-icon">{originNode ? "slot" : "empty"}</span>
        ),
      },
    });

    expect(wrapper.find(".slot-copy-icon").exists()).toBe(true);
  });

  it("supports status in iconRender slot", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const clipboard = navigator.clipboard;

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    });

    const wrapper = mount(ActionsCopy, {
      props: {
        text: "copy value",
      },
      slots: {
        iconRender: ({ status }: any) => (
          <span
            class={
              status === "copied" ? "slot-copy-icon-copied" : "slot-copy-icon"
            }
          >
            {status}
          </span>
        ),
      },
    });

    expect(wrapper.find(".slot-copy-icon").exists()).toBe(true);

    await wrapper.find("button").trigger("click");
    await nextTick();
    await nextTick();

    expect(wrapper.find(".slot-copy-icon-copied").exists()).toBe(true);
    expect(wrapper.find(".anticon-check").exists()).toBe(false);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboard,
    });
  });

  it("copies text prop content", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const clipboard = navigator.clipboard;

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    });

    const wrapper = mount(ActionsCopy, {
      props: {
        text: "copy value",
      },
    });

    await wrapper.find("button").trigger("click");

    expect(writeText).toHaveBeenCalledWith("copy value");

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboard,
    });
  });
});
