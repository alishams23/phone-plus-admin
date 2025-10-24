<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        اطلاعات با موفقیت ویرایش شد
    </v-snackbar>
    <v-container>
        <form @submit.prevent="updateData" class="mt-10">
            <v-locale-provider rtl>
                <v-alert border="start" class="mb-10 ">
                    <div class="pa-3">
                       پس از ثبت نام در سایت زرین پال و درخواست درگاه پرداخت merchantID دریافت شده از زرین پال را در قسمت زیر وارد کنید .
                    </div>
                </v-alert>
               
            

            <v-alert border="start" color="info" icon="fa fa-info" variant="tonal">

                        <div class="text-black">
                            لطفا وارد سایت زرین پال به نشانی <a href="https://zarinpal.com" target="_blank"><b>zarinpal.com</b></a> شده
                            و مراحل ثبت نام خود را تکمیل کنید.
                            <br />
                            اگر هنگام ثبت نام در زرین پال نیازمند کد رهگیری مالیاتی بودید میتوانید طبق آموزش زیر
                            کد رهگیری خودتون رو دریافت کنید.
                            <br />
                            <br />
                            <a href="https://www.aparat.com/v/a6297ef">لینک آموزش</a>
                            <br />
                            <br />
                            پس از ثبت نام موفق از قسمت تنظیمات درگاه کد درگاه پرداخت را در کادر پایین وارد کنید.

                        </div>

                        <div class="mt-4 d-flex">
                            <v-img src="/images/merchant.jpg" class="rounded-lg" max-width="400">

                            </v-img>
                        </div>
                    </v-alert>
                    
                    <div class="d-flex justify-space-between align-center bg-grey-lighten-4 rounded-lg py-2 px-4 mt-4 flex-wrap">
                    <div>دامنه فروشگاه:</div>
                    <div class="d-flex justify-center align-center flex-wrap">
                        <div class="mx-2 text-grey-darken-2" style="max-width: 300px; word-break: break-all;">
                            <p>{{ domain }}</p>
                        </div>
                        <v-btn 
                            @click="copyText" 
                            icon="mdi-content-copy" 
                            size="small" 
                            color="primary" 
                            variant="tonal" 
                            class="mx-2 my-2">
                        </v-btn>
                    </div>
                    <v-snackbar
                        :timeout="2000"
                        v-model="copied"
                        color="gray"
                        rounded="pill"
                        >
                        <p class="text-center">
                            کپی شد <span class="text-bold">{{ domain }}</span>
                        </p>
                    </v-snackbar>
                </div>
                
                <v-text-field
                v-model="merchant_id"
                class="pt-3"
                label="merchantID"
                rounded="lg"
                required
                persistent-hint
                variant="outlined"
                color="primary"
            ></v-text-field>

            <v-checkbox 
                v-model="use_default_payment"  
                @click="value = 0" 
                color="primary" 
                label="از این درگاه استفاده کن"
                class="flex-grow-1" 
                />
                
                <v-btn :loading="loading" rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </v-locale-provider>
        </form>

    </v-container>
    
</template>
<script >
import { PhotoIcon, } from 'vue-tabler-icons';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
export default {
    components: { PhotoIcon, },
    data() {
        return {
            snackbar: false,
            loading: true,
            merchant_id: null,
            id : null,
            domain: null,
            use_default_payment: false,
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
                console.log('Text copied to clipboard');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },  
        getData() {
            axios.get(`${apiStore().address}/api/account/seller-panel/zarinpal-merchant-list/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log(response)
                this.loading = false
                this.merchant_id = response.data[0].merchant_id
                this.id = response.data[0].id
                // this.domain = apiStore().address.replace('https://', `${useUserStore().usernameShop.toLowerCase()}.`)
                this.domain = apiStore().address + "/" + useUserStore().usernameShop.toLowerCase()
                // this.image = response.data[0].image
            }
            )
        },
        async updateData() {
            this.loading = true

            this.fd = new FormData();
                this.fd.append("merchant_id", this.merchant_id);
                this.fd.append("use_default_payment", !this.use_default_payment);
                await axios
                    .patch(
                        `${apiStore().address}/api/account/seller-panel/zarinpal-merchant-update/${this.id}/`,
                        this.fd,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }
                    )
                    .catch(function (error) {
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        }
                    }).then((response) => {
                        this.loading = false
                        this.snackbar = true
                    })
           
        },

    },
}
</script>
