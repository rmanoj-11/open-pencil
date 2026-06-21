import raw from 'unplugin-raw/rolldown'
import { defineConfig } from 'tsdown'

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
    alwaysBundle: [],
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
  plugins: [raw()],
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