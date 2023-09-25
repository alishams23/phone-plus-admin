// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  devServer: {
    port: 3003,
  },
  devtools: { enabled: true }
})
