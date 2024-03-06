<template>

    <slot />  

</template>

<script>
import { useUserStore } from '~/store/user';
export default {
  beforeCreate() {
    const userStore = useUserStore();
    if (!userStore.userToken) {
      // If the userToken does not exist, redirect to the login page
      this.$router.push('/auth');
    }
  },
}
</script>