// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: ['~/scss/style.scss','~/assets/WebFonts/css/fontiran.css',],
 
  devServer: {
    port: 3003,
  },
  devtools: { enabled: true }
})
