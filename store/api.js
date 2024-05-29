import { defineStore } from 'pinia';



export const apiStore = defineStore('api', {
  state: () => ({
    address: 'http://171.22.27.89',
    ws: 'ws://171.22.27.89',
  }),
  actions: {

  },
});