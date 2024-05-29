<template>
</template>
<script>
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default{
    mounted(){

        window.location.href = `http://171.22.27.89/${useUserStore().usernameShop}`;
    }
}
</script>

