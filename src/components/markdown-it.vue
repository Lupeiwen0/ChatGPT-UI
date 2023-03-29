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


<style lang="scss" scoped>
:deep(.hljs) {
  position: relative;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 6px 10px;
  overflow: auto;
  font-size: 14px;

  .__code-block-copy-button__ {
    position: absolute;
    top: 3px;
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