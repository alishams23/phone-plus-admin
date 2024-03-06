<template>

</template>
<script>
import { useUserStore } from '~/store/user';
export default{
    mounted() {
        useUserStore().logout()
        this.$router.push("/auth/");             
    },
}
</script>