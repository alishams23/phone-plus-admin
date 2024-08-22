<template>
</template>
<script>
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default{
    mounted(){

        window.location.href = `https://new.phoneplus.ir//${useUserStore().usernameShop}`;

    }
}
</script>

