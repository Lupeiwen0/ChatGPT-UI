import { defineStore } from 'pinia';
import store from '@/store';
import { createStorage } from '@/utils/Storage.js';
import { Configuration, OpenAIApi } from "openai";

const ApiKey = '__chapt-GPT-Api-key__'
const Storage = createStorage({ storage: localStorage });

export const useSettingStore = defineStore('setting', {
  state: () => ({
    openAiInstance: null,
    systemInfo: {
      role: 'system',
      content: '作为私人助理解决所提出的问题'
    },
    apiKey: import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : (Storage.get(ApiKey) || ''),
    modelMap: [
      { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
      { label: 'gpt-3.5-turbo-0301', value: 'gpt-3.5-turbo-0301' },
      // { label: 'gpt-4', value: 'gpt-4' },
      // { label: 'gpt-4-0314', value: 'gpt-4-0314' },
      // { label: 'gpt-4-32k', value: 'gpt-4-32k' },
      // { label: 'gpt-4-32k-0314', value: 'gpt-4-32k-0314' },
    ],
    currentModel: 'gpt-3.5-turbo',
    chatList: []
  }),
  actions: {
    setApiKey(key = '') {
      if (key === Storage.get(ApiKey) || key.length < 1) return
      Storage.set(ApiKey, key)
      this.initChatAi()
    },
    initChatAi() {
      const configuration = new Configuration({ apiKey: this.apiKey });
      const openAi = new OpenAIApi(configuration);
      this.openAiInstance = openAi

      openAi.listEngines().then(res => {
        console.log(res);
      })
    },

    initChatList(list = []) {
      const systemInfo = list.find(i => i.role === 'system')
      if (systemInfo) {
        this.systemInfo.content = systemInfo.content
      }
      this.chatList = list.filter(i => i.role !== 'system')
    }
  }
});

// 在组件setup函数外使用
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
