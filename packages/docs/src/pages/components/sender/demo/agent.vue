<script setup lang="ts">
import type { MenuProps } from "antdv-next";

import {
  ApiOutlined,
  CodeOutlined,
  EditOutlined,
  OpenAIOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from "@antdv-next/icons";
import { message } from "antdv-next";
import { ref, watch } from "vue";

interface AgentItem {
  icon: any;
  label: string;
}

const agentMap: Record<string, AgentItem> = {
  deep_search: { icon: SearchOutlined, label: "深度搜索" },
  ai_code: { icon: CodeOutlined, label: "写代码" },
  ai_writing: { icon: EditOutlined, label: "帮我写作" },
};

const loading = ref(false);
const deepThink = ref(true);
const activeAgentKey = ref("ai_writing");

const agentItems = Object.entries(agentMap).map(([key, { icon, label }]) => ({
  key,
  label,
  icon,
}));

const agentItemClick: MenuProps["onClick"] = item => {
  activeAgentKey.value = item.key as string;
};

const SwitchTextStyle = {
  display: "inline-flex",
  width: "28px",
  justifyContent: "center",
  alignItems: "center",
};

const IconStyle = { fontSize: "16px" };

watch(loading, val => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      message.success("发送成功！");
      clearTimeout(timer);
    }, 3000);
  }
});

const onSubmit = (v: string) => {
  loading.value = true;
  message.info(`发送消息: ${activeAgentKey.value} | ${v}`);
};

const onCancel = () => {
  loading.value = false;
  message.error("取消发送！");
};
</script>

<template>
  <ax-sender
    :loading="loading"
    placeholder="按 Enter 发送消息"
    :suffix="false"
    :auto-size="{ minRows: 3, maxRows: 6 }"
    :on-submit="onSubmit"
    :on-cancel="onCancel"
  >
    <template #footer="{ components }">
      <a-flex justify="space-between" align="center">
        <a-flex gap="small" align="center">
          <a-button :style="IconStyle" type="text">
            <template #icon>
              <PaperClipOutlined />
            </template>
          </a-button>
          <ax-sender-switch
            :value="deepThink"
            :on-change="(checked: boolean) => (deepThink = checked)"
          >
            <template #icon>
              <OpenAIOutlined />
            </template>
            <template #checkedChildren>
              <div>
                深度搜索：
                <span :style="SwitchTextStyle">开启</span>
              </div>
            </template>
            <template #unCheckedChildren>
              <div>
                深度搜索：
                <span :style="SwitchTextStyle">关闭</span>
              </div>
            </template>
          </ax-sender-switch>
          <a-dropdown
            :menu="{
              selectedKeys: [activeAgentKey],
              onClick: agentItemClick,
              items: agentItems,
            }"
          >
            <template #iconRender="{ key }">
              <SearchOutlined v-if="key === 'deep_search'" />
              <CodeOutlined v-else-if="key === 'ai_code'" />
              <EditOutlined v-else-if="key === 'ai_writing'" />
            </template>
            <ax-sender-switch :value="false">
              <template #icon>
                <SearchOutlined />
              </template>
              功能应用
            </ax-sender-switch>
          </a-dropdown>
        </a-flex>
        <a-flex align="center">
          <a-button type="text" :style="IconStyle">
            <template #icon>
              <ApiOutlined />
            </template>
          </a-button>
          <a-divider type="vertical" />
          <component
            :is="loading ? components.LoadingButton : components.SendButton"
          />
        </a-flex>
      </a-flex>
    </template>
  </ax-sender>
</template>

<docs lang="zh-CN">
智能体输入框。
</docs>

<docs lang="en-US">
Agent input box.
</docs>
