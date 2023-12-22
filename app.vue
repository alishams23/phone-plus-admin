<template>

  <NuxtLoadingIndicator />
  <div>
    <Head>
        <Title>پنل مدیریت phone plus</Title>
     </Head>
</div>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>


</template>


<script>
import { useUserStore } from '~/store/user'; 


export default {
beforeMount() {
    const userStore = useUserStore();

    // Load token from cookie when the layout is created
    userStore.loadTokenFromCookie();
  },
}
</script>