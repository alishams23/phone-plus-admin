export const useUserStore = defineStore('user', {
    state: () => ({
      userToken:useCookie('token')
    }),
    actions: {
      storeToken(token){
        this.userToken = token
        const newCookie = useCookie('token', {
            maxAge: 60*24*28,
            sameSite: true,
            secure: true,
        })
        newCookie.value = this.userToken
    },

 

  
    },
  })