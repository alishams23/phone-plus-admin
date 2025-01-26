<template>
</template>
<script>
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default{
    mounted(){

        window.location.href = `https://phoneplus.ir//${useUserStore().usernameShop}`;

    }
}
</script>

