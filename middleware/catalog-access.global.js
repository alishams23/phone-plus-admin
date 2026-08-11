import { useUserStore } from '~/store/user'

const catalogRoutes = ['/products', '/digitalProducts', '/blog', '/settings/showProfile']

export default defineNuxtRouteMiddleware((to) => {
  const user = useUserStore()
  if (user.shopLifecycle.is_active === false && catalogRoutes.some((route) => to.path.startsWith(route))) {
    return navigateTo('/')
  }
})
