import { createApp, createVNode } from 'vue';

// interface Options {
//   Component: VueComponent; // vue 组件
//   options: any; // 组件参数
// }

/**
 * 创建容器
 */
export const useModal = (Component, options) => {
  const hooksModal = {
    name: 'hooksModal',
    setup() {
      return () => createVNode(Component, { ...options, remove });
    },
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  // remove component and container
  function remove() {
    App.unmount();
    container.remove();
  }
  const App = createApp(hooksModal);
  const vm = App.mount(container);

  return {
    vm,
    remove,
  };
};
