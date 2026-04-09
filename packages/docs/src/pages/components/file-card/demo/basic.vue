<template>
  <a-flex vertical gap="middle">
    <ax-file-card name="excel-has-long-long-long-name.xlsx" :byte="1024" />
    <ax-file-card name="word-file.docx" :byte="1024" />
    <ax-file-card name="pdf-file.pdf" :byte="1024" />
    <ax-file-card name="ppt-file.pptx" :byte="1024" />
    <ax-file-card name="zip-file.zip" :byte="1024" />
    <ax-file-card name="txt-file.txt" :byte="1024" />
    <ax-file-card name="markdown-file.md" :byte="1024" />
    <ax-file-card name="java-file.java" :byte="1024" />
    <ax-file-card name="javascript-file.js" :byte="1024" />
    <ax-file-card name="python-file.py" :byte="1024" />
    <ax-file-card
      :styles="{ file: { width: 350 } }"
      name="excel-file.xlsx"
      :byte="1024"
    />
  </a-flex>
</template>

<docs lang="zh-CN">
基础用法。
</docs>

<docs lang="en-US">
Basic usage.
</docs>
