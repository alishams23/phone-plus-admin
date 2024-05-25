<template>
</template>
<script>
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default{
    mounted(){

        window.location.href = `http://192.168.12.128:8000:3001/${useUserStore().usernameShop}`;
    }
}
</script>

