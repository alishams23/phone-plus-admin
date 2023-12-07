import { createApp } from 'vue';
import Vue3Editor from 'vue3-editor';

export default defineNuxtPlugin((nuxtApp) => {
  const app = createApp({});
  app.use(Vue3Editor);
});