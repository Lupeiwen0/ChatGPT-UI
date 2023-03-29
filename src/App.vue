<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Chat from '@/components/Chat.vue'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <Chat />
  </el-config-provider>
</template>

<style lang="scss">
* {
  -webkit-tap-highlight-color: transparent;
}

html,
body,
div,
p,
section {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul {
  margin: 4px 0;
}

body {
  background-image: url('/static/bg-sprite.png');
  background-position: 0% 0%;
  background-size: 300% 200%;
}
</style>
