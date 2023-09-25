import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const dark = {
  dark: true,
  colors: {
   
  },
}
export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    
    theme: {
    
  
      themes: {
        dark,
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
})