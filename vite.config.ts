import fs from 'node:fs'
import path from 'node:path'
import {
  type Plugin,
  defineConfig,
} from 'vite'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ command }) => {
  const isServe = command === 'serve'

  return {
    build: {
      minify: false,
      commonjsOptions: {
        ignoreDynamicRequires: true,
      },
    },
    plugins: [
      vue(),
      electron({
        main: {
          entry: 'electron/main.ts',
        },
        preload: {
          input: path.join(__dirname, 'electron/preload.ts'),
        },
        renderer: {
          resolve: isServe ? {
            'better-sqlite3': { type: 'cjs' },
          } : undefined,
        },
      }),
      bindingSqlite3({ command }),
      AutoImport({
        resolvers: [
          AntDesignVueResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon',
          })
        ],
        imports: ['vue'],
        dts: path.resolve(__dirname, 'types/auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          AntDesignVueResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          })
        ],
        dts: path.resolve(__dirname, 'types/components.d.ts')
      }),
      //补充一个图标的导入配置
      Icons({
        autoInstall: true,
      }),
    ],
  }
})

function bindingSqlite3(options: {
  output?: string;
  better_sqlite3_node?: string;
  command?: string;
} = {}): Plugin {
  const TAG = '[vite-plugin-binding-sqlite3]'
  options.output ??= 'dist-native'
  options.better_sqlite3_node ??= 'better_sqlite3.node'
  options.command ??= 'build'

  return {
    name: 'vite-plugin-binding-sqlite3',
    config(config) {
      const path$1 = process.platform == 'win32' ? path.win32 : path.posix
      const resolvedRoot = config.root ? path$1.resolve(config.root) : process.cwd()
      const output = path$1.resolve(resolvedRoot, options.output)
      const better_sqlite3 = require.resolve('better-sqlite3')
      const better_sqlite3_root = path$1.join(better_sqlite3.slice(0, better_sqlite3.lastIndexOf('node_modules')), 'node_modules/better-sqlite3')
      const better_sqlite3_node = path$1.join(better_sqlite3_root, 'build/Release', options.better_sqlite3_node)
      const better_sqlite3_copy = path$1.join(output, options.better_sqlite3_node)
      if (!fs.existsSync(better_sqlite3_node)) {
        throw new Error(`${TAG} Can not found "${better_sqlite3_node}".`)
      }
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true })
      }
      fs.copyFileSync(better_sqlite3_node, better_sqlite3_copy)
      /** `dist-native/better_sqlite3.node` */
      const BETTER_SQLITE3_BINDING = better_sqlite3_copy.replace(resolvedRoot + path.sep, '')
      fs.writeFileSync(path.join(resolvedRoot, '.env'), `VITE_BETTER_SQLITE3_BINDING=${BETTER_SQLITE3_BINDING}`)

      console.log(TAG, `binding to ${BETTER_SQLITE3_BINDING}`)
    },
  }
}