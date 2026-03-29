import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: '/SupportInsights/',
=======
  base: '/',
>>>>>>> 6babdba (changes)
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
