// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
    proxy: {
      // Catches any request starting with /api
      '/api/v1': {
        target: 'http://localhost:8000', // Points to your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },

  plugins: [react(),
  tailwindcss(),
  ],
})
