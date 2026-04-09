<template>
  <a-flex vertical gap="middle">
    <ax-file-card
      name="audio-file.mp3"
      src="https://mdn.alipayobjects.com/cto_doraemon/afts/file/HFTcTLugiIAAAAAAgCAAAAgAehe3AQBr"
    />
    <ax-file-card
      name="video-file.mp4"
      src="https://mdn.alipayobjects.com/doraemon_plugin/afts/file/vl7tSa-m3jEAAAAAAAAAAAAAeur1AQBr"
    />
    <ax-file-card name="audio-file.mp3" :byte="1024" type="file" />
    <ax-file-card name="video-file.mp4" :byte="1024" type="file" />
  </a-flex>
</template>

<docs lang="zh-CN">
使用浏览器原生标签。
</docs>

<docs lang="en-US">
Use browser native tags.
</docs>
