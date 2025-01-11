<template>
    <div v-if="loadingData" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <v-progress-circular :size="55" class="ma-10" bg-color="grey4" :width="7" color="blue" indeterminate>
        </v-progress-circular>
    </div>

    <div v-else>
        <div class="pa-4" v-if="show_alert">
            
            <v-alert border="end" color="info" icon="fa fa-info" variant="tonal"
                class="border-opacity-100  my-3 ">
                <template v-slot:prepend>
                    <v-icon>
                        fa fa-info
                    </v-icon>
                </template>
                <div class="text-xs text-right font-weight-black irsa">
                    <p class="text-right">
                        (ممکن است تا ۴۸ ساعت طول بکشد) اطلاعات شما با موفقیت ثبت شد منتظر تایید بمانید
                    </p>
                </div>
            </v-alert>
        </div>
        <v-locale-provider rtl>
            <v-stepper class="ma-4 rounded-lg" v-model="step" :items="items" show-actions bg-color="white" elevation="2"  >
                
                
                
                <template v-slot:actions></template>

                <template v-slot:item.1>
                    <v-container class="px-md-10">
                        <v-alert border="start" class="rtl mt-2 " title="نکته"
                            text="پروفایل شما به عنوان یک فروشنده تایید نشده است. شما ابتدا باید احراز هویت انجام داده و پس از آن میتوانید وارد پنل فروشندگان شوید.">
                        </v-alert>
                        <form @submit.prevent="handleFormSubmit(true)">
                            <v-locale-provider rtl>
                                <v-text-field class="mt-16" label="نام فروشگاه" v-model="shop_name" rounded="lg" required
                                    persistent-hint variant="outlined" color="primary" />

                                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint
                                    :required="N_card_preview ? false : true" variant="outlined" color="primary"
                                    v-model="N_card" @change="handleNCardChange" placeholder="Upload your documents"
                                    label="عکس کارت ملی" prepend-icon="">
                                    <template v-slot:prepend>
                                        <PhotoIcon class="text-grey" />
                                    </template>

                                </v-file-input>
                                <div v-if="N_card_preview" class="image-preview-container ps-10">
                                    <img :src="N_card_preview" class="chip-image-preview" />
                                </div>

                                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint
                                    :required="N_card_face_preview ? false : true" variant="outlined" color="primary"
                                    v-model="N_card_face" @change="handleNCardFaceChange"
                                    placeholder="Upload your documents" label=" عکس صورت همراه با کارت ملی "
                                    prepend-icon="">
                                    <template v-slot:prepend>
                                        <PhotoIcon class="text-grey" />
                                    </template>

                                </v-file-input>
                                <v-alert border="start" color="warning" icon="fa fa-info" variant="tonal"
                                    class=" border-opacity-100 mb-6">
                                    <div class="text-xs irsa">
                                        <p class="text-right"> عکس کارت ملی خود را در مجاور خود گرفته به صورتی که واضح
                                            باشد </p>
                                    </div>
                                </v-alert>
                                <div v-if="N_card_face_preview" class="image-preview-container ps-10">
                                    <img :src="N_card_face_preview" class="chip-image-preview" />
                                </div>
                                <!-- <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint variant="outlined"
                                    color="primary" v-model="shop_card" @change="handleShopCardChange"
                                    placeholder="Upload your documents" label=" کارت مغازه " prepend-icon="">
                                    <template v-slot:prepend>
                                        <PhotoIcon class="text-grey" />
                                    </template>

                                </v-file-input>
                                <div v-if="shop_card_preview" class="image-preview-container ps-10">
                                    <img :src="shop_card_preview" class="chip-image-preview" />
                                </div> -->


                                <div class="d-flex justify-end">
                                    <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                                        class="mx-2 px-5 text-body2 font-weight-bold mb-5" type="submit">
                                        ثبت و ادامه
                                    </v-btn>
                                </div>
                            </v-locale-provider>
                        </form>


                    </v-container>

                </template>

                <template v-slot:item.2>
                    <p class="text-center text-body1 mt-2">
                        برای مشاهده آموزش نحوه دریافت کد اینماد، ویدیو پایین را تماشا کنید.
                    </p>
                    <div class="my-4 d-flex justify-center items-center">
                        <video 
                            controls 
                            class="rounded-lg shadow" 
                            style="width: 100%; max-width: 600px; height: auto;">
                            <source src="" type="video/mp4" />
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
                    </div>
                    <form @submit.prevent="handleFormSubmit(true)">
                        <v-locale-provider rtl>

                            <v-text-field class="pt-4" label="کد اینماد خود را وارد کنید" placeholder="کد اینماد" v-model="enamad_code" rounded="lg" required persistent-hint
                                variant="outlined" color="primary" />

                        </v-locale-provider>
                        <div class="d-flex justify-space-between">
                            <v-btn rounded="lg" persistent-hint variant="tonal" color="black" @click="step--"
                                class="mx-2 px-5 text-body2  mb-5" >
                                بازگشت
                            </v-btn>
                            <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                                class="mx-2 px-5 text-body2 font-weight-bold mb-5" type="submit">
                                ثبت و ادامه
                            </v-btn>
                        </div>
                    </form>
                </template>

                <template v-slot:item.3>
                    <form @submit.prevent="handleFormSubmit()">
                        <v-locale-provider rtl>

                            <v-text-field class="pt-2" label="مرچنت آیدی زرین‌پال" v-model="merchant_id_zarinpal" rounded="lg" required
                                persistent-hint variant="outlined" color="primary" />


                        </v-locale-provider>
                        <div class="d-flex justify-space-between">
                            <v-btn rounded="lg" persistent-hint variant="tonal" color="black" @click="step--"
                                class="mx-2 px-5 text-body2  mb-5">
                                بازگشت
                            </v-btn>
                            <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                                class="mx-2 px-5 text-body2 font-weight-bold mb-5" type="submit">
                                پذیرش قوانین و ثبت
                            </v-btn>
                        </div>

                    </form>
                </template>
            </v-stepper>
        </v-locale-provider>


    </div>
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
            loading: false,
            show_alert: false,
            loadingImage: false,
            loadingData: true,
            id: null,
            is_verified: false,
            put_data: false,

            shop_name: null,
            shop_id: null,

            N_card: null,
            N_card_preview: null,

            N_card_face: null,
            N_card_face_preview: null,

            shop_card: null,
            shop_card_preview: null,

            enamad_code: null,
            merchant_id_zarinpal: null,


            imagePreviews: [],

            domain: null,
            copied: false,
            shipping: 0,
            step: 1,
            items: [
                'اطلاعات فروشگاه',
                'کد اینماد',
                'مرچنت زرینپال',
            ],
            products: [
                {
                    name: 'Product 1',
                    price: 10,
                    quantity: 2,
                },
                {
                    name: 'Product 2',
                    price: 15,
                    quantity: 10,
                },
            ],
        };
    },
    beforeCreate() {
        // const userStore = useUserStore();
        // if (!userStore.userToken) {
        //     // If the userToken does not exist, redirect to the login page
        //     this.$router.push('/auth');
        // }else if (userStore.status == 's'){
        //     useUserStore().logout()
        //     this.$router.push('/auth');
        // }
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
        async handleFormSubmit(go_next = false) {
            try {
                if (this.id != null) {
                    await this.updateData(); // Call update logic if `id` exists
                } else {
                    await this.createData(); // Call create logic otherwise
                    this.getData(false)
                }

                // Increment step after successful submission
                if (go_next) this.step++;
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
        handleNCardChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'N_card_preview');
        },
        handleNCardFaceChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'N_card_face_preview');
        },
        handleShopCardChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'shop_card_preview');
        },
        previewImage(files, previewTarget) {
            if (!files || !files[0]) return;
            const reader = new FileReader();
            reader.onload = e => {
                this[previewTarget] = e.target.result;
            };
            reader.readAsDataURL(files[0]);
        },
        getData(check_step=true) {
            this.loadingData = true
            
            console.log('getData');
            axios.get(`${apiStore().address}/api/account/seller-panel/verify-shop-list`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log('Data', response.data[0])
                if (response.data.length) {
                    this.id = response.data[0].id;
                    this.is_verified = response.data[0].is_verified;
                    this.shop_name = response.data[0].name;
                    this.shop_id = response.data[0].username;
                    this.N_card_preview = response.data[0].image_national_card;
                    this.N_card_face_preview = response.data[0].selfie_with_national_card;
                    this.shop_card_preview = response.data[0].shop_card;
                    this.enamad_code = response.data[0].code_enamad == 'null'?null:response.data[0].code_enamad;
                    this.merchant_id_zarinpal = response.data[0].merchant_zarin =='null'?null:response.data[0].merchant_zarin;
                    this.put_data = true
                    this.domain = apiStore().address.replace('https://', `${this.shop_id.toLowerCase()}.`)
                    console.log('this.enamad_code', this.enamad_code);
                    if(this.merchant_id_zarinpal){
                        this.show_alert= true
                    }
                    if(check_step){
                        if (this.enamad_code){
                            this.step = 3
                        }else if (this.shop_name){
                            this.step = 2
                        }else{
                            this.step = 1
                        }
                    }
                }
                if (this.is_verified) {
                    this.$router.push("/auth/logOut/");
                }
                this.loadingData = false

            }).catch(error => {
                // Handle error response
                console.log('Error')
                console.log(error);
            });
        },
        async updateData() {
            console.log('updateData')

            this.fd = new FormData();

            this.fd.append("name", this.shop_name)
            this.N_card ? this.fd.append("image_national_card", this.N_card[0]) : ''
            this.N_card_face ? this.fd.append("selfie_with_national_card", this.N_card_face[0]) : ''
            this.shop_card ? this.fd.append("shop_card", this.shop_card[0]) : ''
            this.fd.append("merchant_zarin", this.merchant_id_zarinpal)
            this.fd.append("code_enamad", this.enamad_code)

            await axios.patch(
                `${apiStore().address}/api/account/seller-panel/verify-shop-retrieve-update/${this.id}/`,
                this.fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${useUserStore().userToken}`
                    },
                }
            ).then((response) => {
                console.log('Update data', response.data);
                if(this.merchant_id_zarinpal ){
                    this.show_alert = true
                }

            }).catch(function (error) {

                console.log('error', error);

            })

        },
        async createData() {
            console.log('createData');
            this.fd = new FormData();

            this.fd.append("name", this.shop_name)
            this.fd.append("image_national_card", this.N_card)
            this.fd.append("selfie_with_national_card", this.N_card_face)
            this.shop_card ? this.fd.append("shop_card", this.shop_card) : ''
            this.fd.append("merchant_zarin", this.merchant_id_zarinpal)
            this.fd.append("code_enamad", this.enamad_code)

            await axios.post(
                `${apiStore().address}/api/account/seller-panel/verify-shop-create/`,
                this.fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${useUserStore().userToken}`
                    },
                }
            ).then((response) => {
                console.log('Update data', response.data);
            
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                }
            })

        },
    },
    computed: {
        subtotal() {
            return this.products.reduce((acc, product) => acc + product.quantity * product.price, 0)
        },
        total() {
            return this.subtotal + Number(this.shipping ?? 0)
        },
    },
}
</script>
<style scoped >
.negative-margin {
    margin-bottom: -17px;
    width: 98%;
    /* Default to a relatively narrow width */
}
</style>
