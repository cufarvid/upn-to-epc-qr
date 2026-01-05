import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/upn-to-epc-qr/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
      ],
      manifest: {
        name: 'UPN to EPC QR Converter',
        short_name: 'UPN to EPC QR',
        description: 'Convert UPN QR codes to EPC QR codes',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/upn-to-epc-qr/',
        start_url: '/upn-to-epc-qr/',
        orientation: 'portrait',
        icons: [
          {
            src: '/upn-to-epc-qr/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/upn-to-epc-qr/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['utilities', 'finance'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src'),
    },
  },
});
