import { createRequire } from 'node:module'

import raw from 'unplugin-raw/rolldown'
import { defineConfig } from 'tsdown'

const require = createRequire(import.meta.url)

function atlaskitSubpathResolver() {
  const aliases = new Map([
    [
      '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item',
      '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm/tree-item.js'
    ],
    [
      '@atlaskit/pragmatic-drag-and-drop/combine',
      '@atlaskit/pragmatic-drag-and-drop/dist/esm/entry-point/combine.js'
    ],
    [
      '@atlaskit/pragmatic-drag-and-drop/element/adapter',
      '@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js'
    ]
  ])

  return {
    name: 'atlaskit-subpath-resolver',
    resolveId(id: string) {
      const target = aliases.get(id)
      return target ? require.resolve(target) : null
    }
  }
}

export default defineConfig({
  entry: {
    index: './src/index.ts'
  },
  platform: 'browser',
  format: ['esm'],
  dts: {
    sourcemap: true,
    resolver: 'tsc'
  },
  sourcemap: true,
  hash: false,
  clean: true,
  outDir: './dist',
  treeshake: {
    moduleSideEffects: false
  },
  deps: {
    alwaysBundle: [
      '@atlaskit/pragmatic-drag-and-drop',
      /^@atlaskit\/pragmatic-drag-and-drop\//,
      '@atlaskit/pragmatic-drag-and-drop-hitbox',
      /^@atlaskit\/pragmatic-drag-and-drop-hitbox\//
    ],
    neverBundle: [
      'react',
      /^react\//,
      'react-dom',
      /^react-dom\//,
      'react/jsx-runtime',
      '@open-pencil/core',
      /^@open-pencil\/core\//,
      'canvaskit-wasm',
      'use-sync-external-store',
      'nanostores',
      '@nanostores/i18n',
      '@tanstack/react-table',
      'opentype.js',
      'culori',
      'fflate',
      'fzstd',
      'sucrase',
      'diff',
      'es-toolkit',
      /^es-toolkit\//,
      'nanoevents',
      'yoga-layout',
      'jspdf',
      'svg2pdf.js',
      'svgpath',
      'acorn',
      'expr-eval',
      'fontoxpath',
      'twirlwind',
      '@iconify/utils',
      /^@iconify\//,
      '@chenglou/pretext',
      '@tauri-apps/api',
      /^@tauri-apps\//
    ],
    onlyBundle: false
  },
  plugins: [atlaskitSubpathResolver(), raw()],
  inputOptions: {
    preserveEntrySignatures: 'allow-extension',
    checks: {
      pluginTimings: false
    }
  },
  outputOptions: {
    minifyInternalExports: false,
    codeSplitting: {
      groups: [
        {
          test: /(?<!\.d\.c?ts)$/,
          name: (id) => {
            const cleanId = id.split('?')[0]
            const parts = cleanId.split(/[\\/]/g)
            const srcIndex = parts.lastIndexOf('src')
            const file = srcIndex >= 0 ? parts.slice(srcIndex + 1).join('/') : parts.at(-1) ?? 'index'
            return file.replace(/\.(tsx|ts)$/, '')
          }
        }
      ]
    }
  }
})