<script >
import {PhotoIcon,  } from 'vue-tabler-icons';

export default { 
    components:{PhotoIcon,},
    methods: {
    },
    data: () => ({
        first_name: null,
        last_name: null,
        images: [],
        loadingImage:false,
        imagePreviews: [], 
        image: null,
    }),}
</script>
<template>
    <v-container>
        <form  >      
            <v-locale-provider rtl  >
                <v-text-field
                    label="نام کاربری فروشگاه"
                    v-model="shopName"
                    rounded="lg"
                    required
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    class="mt-10"/>
            </v-locale-provider>
            <v-btn
                rounded="lg"
                persistent-hint
                variant="flat"
                color="primary"
                :disabled="loadingImage"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5"
                type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
