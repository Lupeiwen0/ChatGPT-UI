import { defineStore } from 'pinia';
import store from '@/store';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    isSocket: true,
    currentModel: 'gpt-3.5-turbo',
    chatList: [],

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
  }),
  actions: {
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
