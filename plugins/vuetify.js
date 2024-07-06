import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { SquareRoundedIcon , SquareRoundedFilledIcon } from 'vue-tabler-icons';
import '@mdi/font/css/materialdesignicons.css'

const dark = {
  dark: true,
  colors: {
   
  },
}
export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    icons: {
      aliases: {
      checkboxOff: SquareRoundedIcon,
      checkboxOn:SquareRoundedFilledIcon
      }

    },
    theme: {
  
  
      themes: {
        dark,
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
})