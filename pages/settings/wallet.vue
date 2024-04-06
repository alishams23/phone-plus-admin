<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        اطلاعات با موفقیت ویرایش شد
    </v-snackbar>
    <v-container>
        <form @submit.prevent="updateData" class="mt-10">
            <v-locale-provider rtl>
                <v-alert rounded="lg" border="start" class="mb-10 ">
                    <div class="pa-3">
                       پس از ثبت نام در سایت زرین پال و درخواست درگاه پرداخت merchantID دریافت شده از زرین پال را در قسمت زیر وارد کنید .
                    </div>
                </v-alert>
               
            </v-locale-provider>

            <v-text-field
            v-model="merchant_id"
            label="merchantID"
            rounded="lg"
            required
            persistent-hint
            variant="outlined"
            color="primary"
          ></v-text-field>
            <v-btn :loading="loading" rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
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
        };
    },
    mounted() {
        this.getData()
    },
    methods: {
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
                // this.image = response.data[0].image
            }
            )
        },
        async updateData() {
            this.loading = true

            this.fd = new FormData();
                this.fd.append("merchant_id", this.merchant_id);
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