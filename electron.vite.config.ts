import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const sharedAliases = {
  '@renderer': resolve('src/renderer/src'),
  '@server': resolve('src/server'),
  '@shared': resolve('src/shared')
}

export default defineConfig({
  main: {
    resolve: {
      alias: sharedAliases
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: sharedAliases
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: sharedAliases
    },
    plugins: [react()]
  }
})
