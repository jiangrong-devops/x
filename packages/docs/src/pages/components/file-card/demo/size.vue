<script setup lang="ts"></script>

<template>
  <a-flex vertical gap="middle">
    <ax-file-card name="pdf-file.pdf" :byte="1024" size="small" />
    <ax-file-card name="pdf-file.pdf" :byte="1024" size="default" />
  </a-flex>
</template>

<docs lang="zh-CN">
不同大小的卡片。
</docs>

<docs lang="en-US">
Different sizes of cards.
</docs>
