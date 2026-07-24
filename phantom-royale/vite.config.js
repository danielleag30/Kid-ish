import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'maps/*.jpg'],
      manifest: false, // managed manually at /public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        runtimeCaching: [
          {
            // Cache the full cosmetics list — network first, fall back to cache
            urlPattern: /^https:\/\/fortnite-api\.com\/v2\/cosmetics\/br/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cosmetics-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxAgeSeconds: 60 * 60 * 24 }, // 24h
            },
          },
          // Item shop is intentionally NOT cached — always fresh or offline message
        ],
      },
    }),
  ],
})
