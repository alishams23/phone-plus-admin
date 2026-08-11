import axios from 'axios'
import { useUserStore } from '~/store/user'
import { apiStore } from '~/store/api'

export default defineNuxtPlugin(async () => {
  const user = useUserStore()
  if (!user.userToken || user.status !== 's') return

  try {
    const { data } = await axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
      headers: { Authorization: `Token ${user.userToken}` },
    })
    if (data?.[0]) user.setShopLifecycle(data[0])
  } catch (error) {
    console.error('Unable to load shop lifecycle:', error)
  }
})
