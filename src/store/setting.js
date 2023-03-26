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
      content: 'Act as a personal assistant to resolve the issues raised'
    },
    apiKey: import.meta.env.VITE_API_KEY ?? (Storage.get(ApiKey) || '')
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
    }
  }
});

// 在组件setup函数外使用
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
