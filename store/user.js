import { defineStore } from 'pinia';



export const useUserStore = defineStore('user', {
  state: () => ({
    userToken: null,
  }),
  actions: {
    setToken(token) {
      this.userToken = token;
      // Save the token in a cookie
      this.saveTokenInCookie(token);
    },

    // Function to save the token in a cookie
    saveTokenInCookie(token) {
      // Use your preferred cookie library or native document.cookie
      document.cookie = `userToken=${token}; path=/; max-age=3600`; // Set max-age as needed
    },

    // Function to load the token from a cookie
    loadTokenFromCookie() {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userToken='))
        ?.split('=')[1];

      this.userToken = cookieValue || null;
    },
    isAuthenticated() {
      return this.userToken !== null;
    },
    logout() {
      // Clear the user token
      this.userToken = null;
      // Remove the token from the cookie
      document.cookie = 'userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
  },
});