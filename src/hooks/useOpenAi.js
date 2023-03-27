import { ref, nextTick, onMounted, onBeforeMount } from "vue";
import { throttle } from "lodash-es";
import { useClipboard } from '@vueuse/core'
import { ElMessage } from "element-plus";
import { useSettingStore } from '@/store/setting'
import { storeToRefs } from "pinia";

const waitLabel = "请稍等...";

async function registerCopyHandel(e) {

  const { copy } = useClipboard({ legacy: true })

  if (e?.target?.className === '__code-block-copy-button__') {
    let text = e.target?.parentElement?.innerText ?? ''
    // 删除复制按钮自身的内容
    text = text.slice(5)
    await copy(text)
    ElMessage.success('复制成功')
  }
}

export function useOpenAi({ openSetting }) {
  const settingStore = useSettingStore()
  const { openAiInstance, systemInfo, apiKey, currentModel, chatList, isSocket } = storeToRefs(settingStore)

  const pending = ref(false);
  const scrollContainer = ref();
  const keyword = ref("");

  function checkAuth() {
    if (!openAiInstance.value && apiKey.value) {
      settingStore.initChatAi()
    } else if (!apiKey.value) {
      ElMessage.warning('请先设置Api-Key')
      openSetting()
      return false
    }
    return true
  }

  function buildParams() {
    // 保留8组对话 避免tokens消耗过大,如需加大保留对话组，可更改下面 -17的值，当前计算方式为 -(8 * 2 + 1)
    const messages = chatList.value.slice(-17)
    return {
      model: currentModel.value,
      messages: [systemInfo.value, ...messages],
      stream: isSocket.value,
      top_p: 1
    };
  }

  function socketApiChat() {
    pending.value = true;
    const Authorization = openAiInstance.value.configuration.baseOptions.headers.Authorization;
    const params = buildParams();

    chatList.value.push({ role: "assistant", content: waitLabel });
    const index = chatList.value.length - 1;

    fetch(openAiInstance.value?.basePath + '/chat/completions', {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json", Authorization },
    })
      .then((response) => {
        const stream = response.body;
        const reader = stream.getReader();
        const decoder = new TextDecoder('utf-8');
        function readStream() {
          reader.read().then(({ done, value }) => {
            if (done) return
            const text = decoder.decode(value, { stream: true });
            const lines = text.trim().split('\n');
            lines.forEach(line => {
              if (line.length < 1) return;
              const value = isSocket.value ? line.slice(6) : line
              if (value === "[DONE]") {
                pending.value = false;
                return;
              }
              const result = JSON.parse(value);
              if (isSocket.value) {
                // 实时
                const [content] = result.choices;
                if (waitLabel === chatList.value[index].content) chatList.value[index].content = "";
                chatList.value[index].content += content.delta?.content ?? "";
              } else {
                // 完整
                const [messageInfo] = result.choices;
                chatList.value[index].content = messageInfo.message.content;
                pending.value = false;
              }
              scrollBottom();
            });
            readStream();
          });
        };

        readStream();
      })
      .catch((error) => {
        console.error("Connection error", error);
        ElMessage.error('网络错误')
        chatList.value[index].content = 'Error'
        pending.value = false;
      });
  }

  const scrollBottom = throttle(function () {
    nextTick(() => {
      const scrollHeight = scrollContainer.value.wrapRef.scrollHeight || 0;
      const clientHeight = scrollContainer.value.wrapRef.clientHeight || 0;
      const scrollTop = scrollHeight > clientHeight ? scrollHeight - clientHeight : 0;

      scrollContainer.value?.setScrollTop(scrollTop);
    });
  }, 600);

  function sendMessage(event) {
    if (!checkAuth()) return

    if (pending.value) return;

    if (event.shiftKey) {
      keyword.value += "\n";
      return;
    }

    if (!keyword.value.trim()) return;

    chatList.value.push({ role: "user", content: keyword.value });
    keyword.value = "";

    socketApiChat();
  }

  function deleteMessage(index) {
    chatList.value.splice(index, 1)
  }

  onMounted(() => {
    window.addEventListener('click', registerCopyHandel)
  })
  onBeforeMount(() => {
    window.removeEventListener('click', registerCopyHandel)
  })

  return {
    scrollContainer,
    keyword,
    pending,
    deleteMessage,
    sendMessage,
  };
}
