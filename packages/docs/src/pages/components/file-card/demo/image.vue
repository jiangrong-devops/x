<template>
  <a-flex vertical gap="middle">
    <ax-file-card
      name="image-file.png"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <ax-file-card
      :styles="{
        file: {
          width: 100,
          height: 100,
        },
      }"
      name="image-file.png"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
    <ax-file-card
      type="file"
      name="image-file.png"
      :byte="1024"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </a-flex>
</template>

<docs lang="zh-CN">
图片\文件卡片。
</docs>

<docs lang="en-US">
Image\File card.
</docs>
