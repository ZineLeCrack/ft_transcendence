import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, 'index.html'),
			}
		}
	}
})
