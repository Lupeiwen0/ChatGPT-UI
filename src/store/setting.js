import { defineStore } from 'pinia';
import store from '@/store';
import { createStorage } from '@/utils/Storage.js';
import { Configuration, OpenAIApi } from "openai";

const ApiKey = '__chapt-GPT-Api-key__'
const Storage = createStorage({ storage: localStorage });

export const useSettingStore = defineStore('setting', {
  state: () => ({
    isSocket: true,
    currentModel: 'gpt-3.5-turbo',
    chatList: [],
    openAiInstance: null,
    apiKey: import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : (Storage.get(ApiKey) || ''),

    modelMap: [
      { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
      { label: 'gpt-3.5-turbo-0301', value: 'gpt-3.5-turbo-0301' },
      // { label: 'gpt-4', value: 'gpt-4' },
      // { label: 'gpt-4-0314', value: 'gpt-4-0314' },
      // { label: 'gpt-4-32k', value: 'gpt-4-32k' },
      // { label: 'gpt-4-32k-0314', value: 'gpt-4-32k-0314' },
    ],
    systemInfo: {
      role: 'system',
      content: '作为私人助理解决所提出的问题'
    },

    fetchInstanceMap: []
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
    },

    initChatList(list = []) {
      const systemInfo = list.find(i => i.role === 'system')
      if (systemInfo) {
        this.systemInfo.content = systemInfo.content
      }
      this.chatList = list.filter(i => i.role !== 'system')
    },
    clearMessage() {
      this.chatList = []
      this.removeFetchInstance()
    },
    removeFetchInstance() {
      if (this.fetchInstanceMap.length) {
        this.fetchInstanceMap.forEach(item => item.controller?.abort?.())
        this.fetchInstanceMap = []
      }
    }
  }
});

// 在组件setup函数外使用
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
