<template>
  <el-drawer v-model="drawerVisible" title="高级设置" direction="rtl" :size="drawerSize" class="drawer-wrapper">
    <el-auto-resizer>
      <template #default="{ height }">
        <el-scrollbar ref="scrollContainer" :height="height">
          <el-alert title="ChatGPT" type="success" :closable="false" />
          <el-form label-position="top">
            <el-form-item label="Api-Key">
              <el-input placeholder="请输入Api-Key" show-password v-model.trim="apiKey" @blur="changeApiKey"></el-input>
            </el-form-item>
            <el-form-item label="模型">
              <el-select style="width: 100%" placeholder="选择模型" v-model="currentModel">
                <el-option v-for="item in modelMap" :label="item.label" :value="item.value"></el-option>
              </el-select>
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

          <el-alert title="导入/导出" type="success" :closable="false" />
          <el-form label-position="top">
            <el-form-item label="导出对话记录">
              <el-row style="width: 100%">
                <el-col :span="11">
                  <el-button style="width: 100%" type="primary" @click="downloadMdHandle">导出为 MarkDown</el-button>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-button style="width: 100%" type="primary" @click="downloadJsonHandle">导出为 JSON</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="导入对话记录 (文件格式必须和导出文件保持一致)">
              <el-button style="width: 100%" plain type="primary" @click="chooseJsonFile">导入 JSON 文件</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </template>
    </el-auto-resizer>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useSettingStoreWithOut } from '@/store/setting';
import zhCnPromptOptions from '@/prompt/zh-cn.json'
import { ElMessage } from 'element-plus';

const settingStore = useSettingStoreWithOut()
const { systemInfo, apiKey, modelMap, currentModel, chatList } = storeToRefs(settingStore)

const drawerVisible = ref(true)
const drawerSize = computed(() => {
  if (window.innerWidth > 750) return '500px'
  return '100%'
})

const promptVal = ref('')
function choosePrompt(val) {
  promptVal.value = val
  systemInfo.value.content = val
}

function changeApiKey() {
  settingStore.setApiKey(apiKey.value)
}

function chooseJsonFile() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.multiple = false
  input.onchange = (event) => {
    const [file] = event.target.files
    readFile(file)
    input.remove()
  }
  input.click()

  function readFile(file) {
    const reader = new FileReader(); // 创建 FileReader 对象
    reader.onload = function (e) {
      try {
        const content = e.target.result; // 获取文件内容
        const jsonData = JSON.parse(content); // 将内容解析为 JSON 对象

        settingStore.initChatList(jsonData)
        ElMessage.success('导入成功')
      } catch (err) {
        ElMessage.success('导入失败')

      }

    }
    reader.readAsText(file); // 以文本格式读取文件内容
  }
}

// 导出Markdown
function downloadMdHandle() {
  // 生成 markdown 字符串
  const messages = [systemInfo.value, ...chatList.value]
  const markdown = messages.reduce((acc, item) => `${acc}> ${item.role}\n\n${item.content}\n\n`, '');
  const filename = `chat-history-${new Date().valueOf()}.md` // 保存文件的名称
  const blob = new Blob([markdown], { type: 'text/markdown' }) // 将 markdown 文本转化为 Blob 对象
  downloadFn(URL.createObjectURL(blob), filename)
}

// 导出JSON
function downloadJsonHandle() {
  const messages = [systemInfo.value, ...chatList.value]
  // 将 JSON 数据转换为字符串并创建 Blob 对象
  const blob = new Blob([JSON.stringify(messages)], { type: "application/json" });
  // 保存文件的名称
  const filename = `chat-history-${new Date().valueOf()}.json`
  downloadFn(URL.createObjectURL(blob), filename)
}

// 下载文件
function downloadFn(href, fileName) {
  const link = document.createElement('a') // 创建下载链接
  link.style.display = 'none'
  link.download = fileName
  link.href = href
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