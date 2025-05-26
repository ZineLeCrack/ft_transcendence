import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        page1: path.resolve(__dirname, 'src/login/auth.ts'),
        page2: path.resolve(__dirname, 'src/profile/profile.ts'),
        page3: path.resolve(__dirname, 'src/chat/chat.ts'),
        // ajoute ici les autres scripts TypeScript par page
      }
    }
  }
})
