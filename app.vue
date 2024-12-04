<template>
    <VitePwaManifest />

  <NuxtLoadingIndicator />
  <div>
    <Head>
        <Title> مدیریت فروشگاه</Title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

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