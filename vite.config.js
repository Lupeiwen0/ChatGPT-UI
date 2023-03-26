import { defineConfig } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import ElementPlusStyle from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  console.log(command, mode);


  const plugins = [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ prefix: 'Icon' })
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['game-icons', 'ph'],
        })
      ],
    }),
    ElementPlusStyle({
      ignoreComponents: ['AutoResizer'],
    }),
    Icons({
      autoInstall: true,
    })
  ]

  return {
    base: '/',

    // path resolve
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
    },

    server: {
      host: '0.0.0.0',
      port: 9100,
    },

    plugins,

    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: false,
          drop_console: isBuild,
          drop_debugger: isBuild,
        },
      },
    }
  }
})
