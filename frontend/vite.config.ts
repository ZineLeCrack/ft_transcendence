import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, 'index.html'),
				login: path.resolve(__dirname, 'src/login/login.html'),
				a2f: path.resolve(__dirname, 'src/login/a2f.html'),
				profile: path.resolve(__dirname, 'src/profile/profile.html'),
				search: path.resolve(__dirname, 'src/search/search.html'),
				local: path.resolve(__dirname, 'src/game/local/local.html'),
				multiplayer: path.resolve(__dirname, 'src/game/multiplayer/multiplayer.html'),
				tournaments: path.resolve(__dirname, 'src/game/tournaments/tournaments.html'),
				ai: path.resolve(__dirname, 'src/game/ai/ai.html'),
			}
		}
	}
})
