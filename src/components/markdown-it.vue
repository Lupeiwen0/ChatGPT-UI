<template>
  <div class="markdown-it__wrapper" v-html="htmlStr"></div>
</template>

<script setup>
import { computed } from 'vue'
import { mdStr2html } from '@/utils/tools'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const htmlStr = computed(() => mdStr2html(props.modelValue))

</script>


<style lang="scss">
code {
  display: inline-block;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.02);
  font-size: 14px;
  line-height: 18px;
  padding: 6px 10px;
}
</style>

<style lang="scss" scoped>
.markdown-it__wrapper {
  overflow: auto;
}

:deep(.hljs) {
  position: relative;
  width: 100%;
  overflow: hidden;


  .__code-block-copy-button__ {
    position: absolute;
    top: 6px;
    right: 10px;
    font-size: 12px;
    text-align: center;
    color: #9c9c9c;
    padding: 2px 4px;
    background-color: rgba($color: #000000, $alpha: 0.1);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
  }

  code {
    width: inherit;

    border: 1px solid rgba(0, 0, 0, 0.1);
    overflow-y: hidden;
    overflow-x: auto;



  }
}

:deep(table) {
  width: 100%;
  /*表格宽度*/
  max-width: 65em;
  /*表格最大宽度，避免表格过宽*/
  border: 1px solid #dedede;
  /*表格外边框设置*/
  margin: 15px auto;
  /*外边距*/
  border-collapse: collapse;
  /*使用单一线条的边框*/
  empty-cells: show;
  /*单元格无内容依旧绘制边框*/
  overflow: auto;


  th,
  td {
    height: 35px;
    /*统一每一行的默认高度*/
    border: 1px solid #dedede;
    /*内部边框样式*/
    padding: 0 10px;
    /*内边距*/
  }

  th {
    font-weight: bold;
    /*加粗*/
    text-align: center !important;
    /*内容居中，加上 !important 避免被 Markdown 样式覆盖*/
    background: rgba(158, 188, 226, 0.2);
    /*背景色*/
    white-space: nowrap;
    /*表头内容强制在一行显示*/
  }

  tbody tr:nth-child(2n) {
    background: rgba(158, 188, 226, 0.12);
  }

  tr:hover {
    background: #efefef;
  }
}
</style>