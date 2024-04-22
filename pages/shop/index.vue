<template>
</template>
<script>
import { useUserStore } from '~/store/user';

export default{
    mounted(){

        window.location.href = `http://171.22.27.89:3001/${useUserStore().usernameShop}`;
    }
}
</script>

