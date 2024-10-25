<template>

  <NuxtLoadingIndicator />
  <div>
    <Head>
        <Title> مدیریت فروشگاه</Title>
     </Head>
</div>
  <div>
    <ClientOnly>

    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </ClientOnly>
  </div>


</template>


<script>
import { useUserStore } from '~/store/user'; 


export default {
beforeMount() {
    const userStore = useUserStore();

    // Load token from cookie when the layout is created
    userStore.loadTokenAndUsernameFromCookie();
  },
  mounted(){
   
  }
}
</script>