import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vite-plus/test";

import ActionsItem from "../ActionsItem";

describe("ActionsItem", () => {
  it("renders default icon without status", () => {
    const wrapper = mount(ActionsItem, {
      props: {
        defaultIcon: "default-icon",
      },
    });

    expect(wrapper.text()).toContain("default-icon");
  });

  it("falls back to default icon for unknown status", () => {
    const wrapper = mount(ActionsItem, {
      props: {
        defaultIcon: "default-icon",
        status: "unknown" as any,
      },
    });

    expect(wrapper.text()).toContain("default-icon");
  });

  it("supports defaultIcon and runningIcon slots", () => {
    const defaultWrapper = mount(ActionsItem, {
      props: {
        defaultIcon: "default-icon",
      },
      slots: {
        defaultIcon: () => "slot-default",
      },
    });

    const runningWrapper = mount(ActionsItem, {
      props: {
        defaultIcon: "default-icon",
        runningIcon: "running-icon",
        status: "running",
      },
      slots: {
        runningIcon: () => "slot-running",
      },
    });

    expect(defaultWrapper.text()).toContain("slot-default");
    expect(runningWrapper.text()).toContain("slot-running");
  });
});
