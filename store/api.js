import { defineStore } from 'pinia';



export const apiStore = defineStore('api', {
  state: () => ({
    address: 'https://phoneplus.ir',
    // address: 'http://127.0.0.1:8000',
    // address: 'http://192.168.1.105:8000',
    ws: 'wss://phoneplus.ir',
  }),
  actions: {

  },
});
