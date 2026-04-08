<script setup lang="ts">
const senderRef = useTemplateRef("senderRef");
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="middle" wrap>
      <a-button @click="senderRef?.insert('Hello ', 'start')">
        Insert at Start
      </a-button>
      <a-button @click="senderRef?.insert(' World', 'end')">
        Insert at End
      </a-button>
      <a-button @click="senderRef?.insert('🐛 ', 'cursor')">
        Insert at Cursor
      </a-button>
      <a-button @click="senderRef?.focus()"> Focus </a-button>
      <a-button @click="senderRef?.focus({ cursor: 'start' })">
        Focus at Start
      </a-button>
      <a-button @click="senderRef?.focus({ cursor: 'end' })">
        Focus at End
      </a-button>
      <a-button @click="senderRef?.focus({ cursor: 'all' })">
        Select All
      </a-button>
      <a-button @click="senderRef?.focus({ preventScroll: true })">
        Focus (Prevent Scroll)
      </a-button>
      <a-button @click="senderRef?.blur()"> Blur </a-button>
      <a-button @click="senderRef?.clear()"> Clear </a-button>
    </a-flex>
    <ax-sender ref="senderRef" />
  </a-flex>
</template>

<docs lang="zh-CN">
使用 `ref` 选项控制聚焦、文本插入等。
</docs>

<docs lang="en-US">
Use the `ref` option to control focus, text insertion, and more.
</docs>
