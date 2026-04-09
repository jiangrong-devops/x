<script setup lang="ts">
import type { FileCardProps } from "@antdv-next/x";

const files: FileCardProps[] = [
  {
    name: "excel-file.xlsx",
    byte: 1024,
  },
  {
    name: "word-file.docx",
    byte: 1024,
  },
  {
    name: "pdf-file.pdf",
    byte: 1024,
  },
  {
    name: "ppt-file.pptx",
    byte: 1024,
  },
  {
    name: "zip-file.zip",
    byte: 1024,
  },
  {
    name: "txt-file.txt",
    byte: 1024,
  },
];

const images: FileCardProps[] = Array.from({ length: 6 }).map(() => ({
  name: "image-file.png",
  src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
}));

const largeImages: FileCardProps[] = Array.from({ length: 3 }).map(() => ({
  name: "image-file.png",
  src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
}));
</script>

<template>
  <a-flex vertical gap="middle" style="width: 900px">
    <ax-file-card-list :items="files" removable />
    <ax-file-card-list :items="files" removable size="small" />
    <ax-file-card-list :items="images" />
    <ax-file-card-list
      :styles="{ file: { width: '230px', height: '230px' } }"
      :items="largeImages"
    />
  </a-flex>
</template>

<docs lang="zh-CN">
使用列表展示多个文件卡片。
</docs>

<docs lang="en-US">
Use list to show multiple file cards.
</docs>
