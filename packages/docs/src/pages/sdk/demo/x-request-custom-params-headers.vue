<script setup lang="ts">
import type { ThoughtChainItemType } from "@antdv-next/x";

import { LoadingOutlined, TagsOutlined } from "@antdv-next/icons";
import { ThoughtChain } from "@antdv-next/x";
import { XRequest } from "@antdv-next/x-sdk";
import { Button, Descriptions, Splitter } from "antdv-next";
import { computed, h, ref } from "vue";

import { useLocale } from "@/composables/use-locale";

const QUERY_URL = "https://api.x.ant.design/api/default_chat_provider_stream";

const useXRequestLocale = () => {
  const { locale: docsLocale } = useLocale();
  const isCN = docsLocale.value === "zh-CN";
  return {
    request: isCN ? "请求" : "Request",
    requestLog: isCN ? "请求日志" : "Request Log",
    status: isCN ? "状态" : "Status",
    updateTimes: isCN ? "更新次数" : "Update Times",
    replaceNotice: isCN
      ? "请替换 BASE_URL、PATH 和参数为您自己的值"
      : "Please replace the BASE_URL, PATH and parameters, with your own values.",
  };
};

const status = ref<ThoughtChainItemType["status"]>();
const lines = ref<Record<string, string>[]>([]);
const locale = computed(() => useXRequestLocale());

const request = () => {
  status.value = "loading";

  XRequest(QUERY_URL, {
    params: {
      query: "gpt-3.5-turbo",
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "hello, who are u?" }],
      stream: true,
      agentId: 111,
    },
    headers: {
      "X-header": "ADX",
    },
    callbacks: {
      onSuccess: messages => {
        status.value = "success";
        console.log("onSuccess", messages);
      },
      onError: error => {
        status.value = "error";
        console.error("onError", error);
      },
      onUpdate: msg => {
        lines.value = [...lines.value, msg];
        console.log("onUpdate", msg);
      },
    },
  });
};
</script>

<template>
  <Splitter>
    <Splitter.Panel>
      <Button type="primary" :disabled="status === 'loading'" @click="request">
        {{ locale.request }} - {{ QUERY_URL }}
      </Button>
    </Splitter.Panel>
    <Splitter.Panel :style="{ marginLeft: '16px' }">
      <ThoughtChain
        :items="[
          {
            title: locale.requestLog,
            status: status,
            icon: status === 'loading' ? h(LoadingOutlined) : h(TagsOutlined),
            description: status === 'error' ? locale.replaceNotice : undefined,
            content: h(Descriptions, { column: 1 }, () => [
              h(
                Descriptions.Item,
                { label: locale.status },
                () => status || '-',
              ),
              h(
                Descriptions.Item,
                { label: locale.updateTimes },
                () => lines.length,
              ),
            ]),
          },
        ]"
      />
    </Splitter.Panel>
  </Splitter>
</template>

<docs lang="zh-CN">
自定义参数和请求头配置，支持完整请求定制。
</docs>

<docs lang="en-US">
Custom parameters and headers configuration for full request customization.
</docs>
