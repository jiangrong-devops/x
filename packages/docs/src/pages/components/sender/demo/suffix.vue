<script setup lang="ts">
import { OpenAIOutlined } from "@antdv-next/icons";
import { message } from "antdv-next";
import { ref } from "vue";

const value = ref("");
const loading = ref(false);

function handleSubmit() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    value.value = "";
    message.success("Send message successfully!");
  }, 2000);
}
</script>

<template>
  <ax-sender
    submit-type="shiftEnter"
    :value="value"
    :loading="loading"
    :on-change="(v: string) => (value = v)"
    :on-submit="handleSubmit"
    :on-cancel="() => (loading = false)"
  >
    <template #suffix="{ components }">
      <a-space size="small">
        <a-typography-text type="secondary" :style="{ whiteSpace: 'nowrap' }">
          <small>`Shift + Enter` to submit</small>
        </a-typography-text>
        <component :is="components.ClearButton" />
        <component :is="components.SpeechButton" />
        <component
          :is="loading ? components.LoadingButton : components.SendButton"
          type="primary"
          :disabled="false"
        >
          <template v-if="!loading" #icon>
            <OpenAIOutlined />
          </template>
        </component>
      </a-space>
    </template>
  </ax-sender>
</template>

<docs lang="zh-CN">
通过 `suffix` 属性，可以自定义发送按钮的行为。
</docs>

<docs lang="en-US">
Customize the behavior of the send button through the `suffix` property.
</docs>
