<template>
</template>
<script>
import { useUserStore } from '~/store/user';

export default{
    mounted(){
        this.$router.push('http://171.22.27.89:3001')
        useUserStore().usernameShop,
    }
}
</script>

