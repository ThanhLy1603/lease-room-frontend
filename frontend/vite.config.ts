import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
   ],
   server: {
      port: 3000,
   },
   build: {
      rollupOptions: {
         output: {
            manualChunks(id) {
               // Gom các thư viện trong node_modules thành file vendor riêng
               if (id.includes('node_modules')) {
                  return 'vendor';
               }
            },
         },
      },
   },
})