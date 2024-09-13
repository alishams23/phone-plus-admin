import { defineStore } from 'pinia';



export const apiStore = defineStore('api', {
  state: () => ({
    // address: 'https://new.phoneplus.ir',
    address: 'http://127.0.0.1:8000',
    ws: 'wss://new.phoneplus.ir',
  }),
  actions: {

  },
});