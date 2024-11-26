// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  build: {
    transpile: ["vuetify"],
  },
  css: ['~/scss/style.scss','~/assets/WebFonts/css/fontiran.css',],
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@vite-pwa/nuxt'],

  devServer: {
    port: 3003,
    // host:"0"
  },
  devtools: { enabled: true },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
    lang: 'fa',
    name: 'panel phone plus',
    orientation: 'portrait',
    background_color: '#FFFFFF',
    theme_color: '#A020F0',
    short_name: 'فون پلاس',
    description: '  پنل فروشندگان فون پلاس',
    start_url: '/',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    },
     
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
     
    },
 

  /* your pwa options */
},
})