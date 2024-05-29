<template>
</template>
<script>
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default{
    mounted(){

<<<<<<< HEAD
        window.location.href = `http://171.22.27.89:3001/${useUserStore().usernameShop}`;
=======
        window.location.href = `http://171.22.27.89/${useUserStore().usernameShop}`;
>>>>>>> 8336b8e5e4cda82cb28dbede460a7f9c8b2915cb
    }
}
</script>

