<template>
  <el-drawer v-model="drawerVisible" title="高级设置" direction="rtl" size="600px" class="drawer-wrapper">
    <el-auto-resizer>
      <template #default="{ height }">
        <el-scrollbar ref="scrollContainer" :height="height">
          <el-alert title="ChatGPT" type="success" :closable="false" />
          <el-form label-position="top">
            <el-form-item label="Api-Key">
              <el-input placeholder="请输入Api-Key" show-password v-model.trim="apiKey" @blur="changeApiKey"></el-input>
            </el-form-item>
          </el-form>

          <el-alert title="Prompt" type="success" :closable="false" />
          <el-form label-position="top">
            <el-form-item label="System prompt">
              <el-input type="textarea" placeholder="请输入..." resize="none" :rows="6"
                v-model="systemInfo.content"></el-input>
            </el-form-item>
            <el-form-item label="选择 prompt 模板">
              <el-select style="width: 100%" placeholder="选择 prompt 模板" filterable @change="choosePrompt"
                v-model="promptVal">
                <el-option v-for="item in zhCnPromptOptions" :value="item.prompt" :label="item.act"></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <el-alert title="保存导出" type="success" :closable="false" />
          <el-form label-position="top">
            <el-form-item label="导出对话记录">
              <el-button style="width: 100%" type="primary" @click="downloadHandle">导出为 MarkDown</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </template>
    </el-auto-resizer>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useSettingStoreWithOut } from '@/store/setting';
import zhCnPromptOptions from '@/prompt/zh-cn.json'
import MarkdownIt from 'markdown-it'


const settingStore = useSettingStoreWithOut()
const { systemInfo, apiKey } = storeToRefs(settingStore)

const drawerVisible = ref(true)

const promptVal = ref('')
function choosePrompt(val) {
  promptVal.value = val
  systemInfo.value.content = val
}

function changeApiKey() {
  settingStore.setApiKey(apiKey.value)
}


function downloadHandle() {
  const messages = document.querySelectorAll('.markdown-it__wrapper') // 获取每一条对话信息的 DOM 节点

  const markdown = []
  messages.forEach(message => {
    const md = MarkdownIt().render(message.textContent.trim()) // 使用 markdown-it 将文本内容转化为 markdown 格式
    markdown.push(md)
  })

  const content = markdown.join('\n\n') // 将每条消息转化的 markdown 内容拼接起来
  const filename = `chat-history-${new Date().valueOf()}.md` // 保存文件的名称

  const blob = new Blob([content], { type: 'text/markdown' }) // 将 markdown 文本转化为 Blob 对象
  const link = document.createElement('a') // 创建下载链接
  link.style.display = 'none'
  link.download = filename
  link.href = URL.createObjectURL(blob)
  link.click() // 模拟点击下载链接
  link.remove

}

</script>

<style lang="scss">
.drawer-wrapper {
  background-image: url('/static/bg-sprite.png');
  background-position: 0% 0%;
  background-size: 300% 200%;

  .el-drawer__header {
    margin-bottom: 10px;
    --el-drawer-padding-primary: 16px 20px 0;
  }

  .el-drawer__body {
    --el-drawer-padding-primary: 16px 20px;
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-alert) {
  margin-bottom: 12px;
}

:deep(.el-alert__content) {
  margin: 0 auto;
}
</style>