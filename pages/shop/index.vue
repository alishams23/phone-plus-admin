<template>
</template>
<script>
import { useUserStore } from '~/store/user';

export default{
    mounted(){

        window.location.href = `http://192.168.237.128:8000:3001/${useUserStore().usernameShop}`;
    }
}
</script>

