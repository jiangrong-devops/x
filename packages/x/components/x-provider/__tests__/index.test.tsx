import { mount } from "@vue/test-utils";
import { ConfigProvider } from "antdv-next";
import { describe, expect, it, vi } from "vite-plus/test";

import {
  Bubble,
  CodeHighlighter,
  Conversations,
  FileCard,
  Sender,
  Sources,
  Suggestion,
  Think,
  ThoughtChain,
} from "../../index";
import XProvider from "../index";

describe("XProvider", () => {
  it("injects bubble component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            bubble={{
              classes: {
                root: "test-bubble",
              },
            }}
          >
            <Bubble content="test" />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-bubble").exists()).toBe(true);
  });

  it("injects conversations component config", async () => {
    const onClick = vi.fn();

    const wrapper = mount({
      render() {
        return (
          <XProvider
            conversations={{
              classes: {
                root: "test-conversations",
              },
            }}
          >
            <Conversations creation={{ onClick }} />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-conversations").exists()).toBe(true);

    await wrapper.get(".antd-conversations-creation").trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("injects file-card component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            fileCard={{
              classes: {
                root: "test-file-card",
              },
            }}
          >
            <FileCard name="test.pdf" byte={1024} />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-file-card").exists()).toBe(true);
  });

  it("injects suggestion component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            suggestion={{
              classes: {
                root: "test-suggestion",
              },
            }}
          >
            <Suggestion items={[{ label: "Test", value: "test" }]}>
              {({ onKeyDown }: any) => <input onKeydown={onKeyDown} />}
            </Suggestion>
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-suggestion").exists()).toBe(true);
  });

  it("injects sender component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            sender={{
              classes: {
                root: "test-sender",
                prefix: "test-sender-prefix",
              },
            }}
          >
            <Sender prefix="Prefix" />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-sender").exists()).toBe(true);
    expect(wrapper.find(".test-sender-prefix").exists()).toBe(true);
  });

  it("injects sources component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            sources={{
              classes: {
                root: "test-sources",
              },
            }}
          >
            <Sources title="Sources" />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-sources").exists()).toBe(true);
  });

  it("injects think component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            think={{
              classes: {
                root: "test-think",
                status: "test-think-status",
              },
            }}
          >
            <Think title="Thinking" />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-think").exists()).toBe(true);
    expect(wrapper.find(".test-think-status").exists()).toBe(true);
  });

  it("injects thought-chain component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            thoughtChain={{
              classes: {
                root: "test-thought-chain",
              },
            }}
          >
            <ThoughtChain items={[{ title: "Step" }]} />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-thought-chain").exists()).toBe(true);
  });

  it("injects code-highlighter component config", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            codeHighlighter={{
              classes: {
                root: "test-code-highlighter",
                header: "test-code-highlighter-header",
              },
            }}
          >
            <CodeHighlighter content="const answer = 42" language="ts" />
          </XProvider>
        );
      },
    });

    expect(wrapper.find(".test-code-highlighter").exists()).toBe(true);
    expect(wrapper.find(".test-code-highlighter-header").exists()).toBe(true);
  });

  it("passes iconPrefixCls and theme config to ConfigProvider", () => {
    const wrapper = mount({
      render() {
        return (
          <XProvider
            iconPrefixCls="tom-icon"
            theme={{ token: { motion: false } }}
          >
            <Conversations creation={{}} />
          </XProvider>
        );
      },
    });

    const configProvider = wrapper.getComponent(ConfigProvider);

    expect(configProvider.props("iconPrefixCls")).toBe("tom-icon");
    expect(configProvider.props("theme")).toEqual({
      token: { motion: false },
    });
  });
});
