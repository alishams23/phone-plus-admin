<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        اطلاعات با موفقیت ویرایش شد
    </v-snackbar>
    <v-container>
        <v-locale-provider rtl>
        <p class="text-center text-body1 mt-2">
        برای مشاهده آموزش نحوه دریافت کد اینماد، ویدیو پایین را تماشا کنید.
    </p>
    <div class="my-4 d-flex justify-center items-center">
        <video controls class="rounded-lg shadow" style="width: 100%; max-width: 600px; height: auto;">
            <source src="/video/video.mp4" type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند
        </video>
    </div>
    <div class="my-4 mt-16 rounded-lg w-10">
        <div class="d-flex justify-space-between align-center bg-grey-lighten-4 rounded-lg py-2 px-4 flex-wrap">
            <div>دامنه فروشگاه:</div>
            <div class="d-flex justify-center align-center flex-wrap">
                <div class="mx-2 text-grey-darken-2" style="max-width: 300px; word-break: break-all;">
                    <p>{{ domain }}</p>
                </div>
                <v-btn @click="copyText" icon="mdi-content-copy" size="small" color="primary" variant="tonal"
                    class="mx-2 my-2">
                </v-btn>
            </div>
            <v-snackbar :timeout="2000" v-model="copied" color="gray" rounded="pill">
                <p class="text-center">
                    کپی شد <span class="text-bold">{{ domain }}</span>
                </p>
            </v-snackbar>
        </div>
    </div>
    </v-locale-provider>

        <form @submit.prevent="updateData">
            <v-locale-provider rtl>
                <v-text-field 
                class="pt-4"    
                label="کد اینماد خود را وارد کنید"  
                placeholder="کد اینماد"     
                v-model="enamad_code"
                rounded="lg" 
                required 
                persistent-hint 
                variant="outlined" 
                color="primary" 
            />
            </v-locale-provider>
        
            <v-btn 
                :loading="loading"  
                type="submit"   
                rounded="lg" 
                persistent-hint 
                variant="flat" 
                color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5">
                ثبت
            </v-btn>
        
    </form>
</v-container>

</template>
<script>
import { PhotoIcon, } from 'vue-tabler-icons';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
export default {
    components: { PhotoIcon, },
    data() {
        return {
            id: null,
            snackbar: false,
            loading: true,
            domain: null,
            enamad_code: null,
        };
    },
    mounted() {
        this.getData()
    },
    methods: {
        async copyText() {
            try {
                this.copied = true
                await navigator.clipboard.writeText(this.domain);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },  
        getData() {
            axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.id = response.data[0].id
                this.loading = false
                this.enamad_code = response.data[0].enamad_code
                this.domain = apiStore().address + "/" + useUserStore().usernameShop.toLowerCase()
            }
            )
        },
        async updateData() {
            this.loading = true

            this.fd = new FormData();
            this.fd.append("enamad_code", this.enamad_code);
            await axios
                .patch(
                    `${apiStore().address}/api/account/seller-panel/shop-update/${this.id}/`,
                    this.fd,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Token ${useUserStore().userToken}`
                        },
                    }
                )
                .catch(function (error) {
                 
                }).then((response) => {
                    this.snackbar = true

                    setTimeout(() => {
                        window.location.reload(true)
                        this.loading = false
                    }, 3000);
                })

        },

    },
}
</script>
