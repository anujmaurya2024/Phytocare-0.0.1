import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png'],

      // ── Web App Manifest ────────────────────────────────────────────────
      manifest: {
        name: 'PhytoCare',
        short_name: 'PhytoCare',
        description: 'AI-powered potato & tomato leaf disease detection for farmers',
        theme_color: '#10b981',
        background_color: '#0a1a0f',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },

      // ── Workbox Service Worker Strategies ───────────────────────────────
      workbox: {
        // Cache static assets aggressively (Cache-First)
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],

        // Runtime caching rules
        runtimeCaching: [
          // /diseases encyclopedia route — Network-First for fresh data
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/diseases') ||
              url.pathname === '/api/diseases',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'diseases-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // Google Fonts — Cache-First (rarely changes)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },

          // Backend API — Network-Only (predictions require live model)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/predict'),
            handler: 'NetworkOnly',
          },
        ],

        // Skip waiting so updates activate immediately
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
