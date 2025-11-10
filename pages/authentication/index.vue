<template>
    <div v-if="loadingData" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <v-progress-circular :size="55" class="ma-10" bg-color="grey-lighten-4" :width="5" color="blue" indeterminate>
        </v-progress-circular>
    </div>

    <div v-else>
        
        <v-locale-provider rtl>
            <v-container class="px-md-10">
                        <!-- <v-alert border="start" class="rtl mt-2 " title="نکته"
                            text="پروفایل شما به عنوان یک فروشنده تایید نشده است. شما ابتدا باید احراز هویت انجام داده و پس از آن میتوانید وارد پنل فروشندگان شوید.">
                        </v-alert> -->
                        <form @submit.prevent="handleFormSubmit(true)">
                            
                            <v-locale-provider rtl>
                                <v-row align="center" justify="center">
                                    <v-col cols="12" sm="6">
   
                                        <v-text-field 
                                            class="mt-10" 
                                            label="نام فروشگاه" 
                                            v-model="shop_name" 
                                            rounded="lg"
                                            required 
                                            persistent-hint 
                                            variant="outlined" 
                                            color="primary" 
                                        />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field 
                                            class="mt-10" 
                                            label="آیدی فروشگاه" 
                                            v-model="shop_id" 
                                            rounded="lg"
                                            required 
                                            persistent-hint 
                                            variant="outlined" 
                                            color="primary" 
                                        />
                                                            
                                    </v-col>
                                </v-row>
                                
                                <v-textarea
                                    color="primary" 
                                    v-model="shop_bio" 
                                    rounded="lg" 
                                    variant="outlined" 
                                    label="توضیحات بیشتر راجب فروشگاه"
                                    persistent-hint 
                                    
                                />

                                <v-file-input 
                                    rounded="lg"   
                                    accept=".png,.jpg"  
                                    persistent-hint
                                    :required="logo_preview ? false : true"   
                                    variant="outlined" 
                                    color="primary"
                                    v-model="logo" 
                                    @change="handleLogoChange" 
                                    placeholder="Upload your documents"
                                    label="لوگو فروشگاه"    
                                    prepend-icon="">
                                    
                                    <template v-slot:prepend>
                                        <PhotoIcon class="text-grey" />
                                    </template>

                                </v-file-input>

                                
                                <div v-if="logo_preview" class="image-preview-container ps-10">
                                    <img :src="logo_preview" class="chip-image-preview" />
                                </div>

                                <!-- <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint
                                    :required="N_card_face_preview ? false : true" variant="outlined" color="primary"
                                    v-model="N_card_face" @change="handleNCardFaceChange"
                                    placeholder="Upload your documents" label=" عکس صورت همراه با کارت ملی "
                                    prepend-icon="">
                                    <template v-slot:prepend>
                                        <PhotoIcon class="text-grey" />
                                    </template>

                                </v-file-input>

                               -->


                                <div class="d-flex justify-end">
                                    <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                                        class="mx-2 px-5 text-body2 font-weight-bold mb-5" type="submit">
                                        قبول قوانین و قرارداد و ثبت
                                    </v-btn>
                                </div>
                            </v-locale-provider>
                        </form>


                    </v-container>
            
        </v-locale-provider>
        
        <div class="pa-4" v-if="show_alert">
            <v-alert border="end" color="info" icon="fa fa-info" variant="tonal" class="border-opacity-100  my-3 ">
                <template v-slot:prepend>
                    <v-icon>
                        fa fa-info
                    </v-icon>
                </template>
                <div class="text-xs text-right irsa">
                    <p class="text-right text-black ">
                        اطلاعات شما با موفقیت ثبت شد منتظر تایید بمانید <span
                            class="text-body-1 mx-3 text-grey-darken-2">ممکن است تا ۴۸
                            ساعت طول بکشد</span>
                    </p>
                </div>
            </v-alert>
        </div>

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
            shop_bio: null,

            logo: null,
            logo_preview: null,

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
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },
        async handleFormSubmit(go_next = false) {
            try {
                // if (this.id != null) {
                //     await this.updateData(); // Call update logic if `id` exists
                // } else {
                //     await this.createData(); // Call create logic otherwise
                //     this.getData(false)
                // }
                await this.createData(); // Call create logic otherwise
                
                // Increment step after successful submission
                if (go_next) this.step++;
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
        handleLogoChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'logo_preview');
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
        getData(check_step = true) {
            this.loadingData = true

            axios.get(`${apiStore().address}/api/account/seller-panel/verify-shop-list`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                if (response.data.length) {
                    this.id = response.data[0].id;
                    this.is_verified = response.data[0].is_verified;
                    this.shop_name = response.data[0].name;
                    this.shop_id = response.data[0].username;
                    this.logo_preview = response.data[0].image_national_card;
                    this.N_card_face_preview = response.data[0].selfie_with_national_card;
                    this.shop_card_preview = response.data[0].shop_card;
                    this.enamad_code = response.data[0].code_enamad == 'null' ? null : response.data[0].code_enamad;
                    this.merchant_id_zarinpal = response.data[0].merchant_zarin == 'null' ? null : response.data[0].merchant_zarin;
                    this.put_data = true
                    this.domain = apiStore().address.replace('https://', `${this.shop_id.toLowerCase()}.`)
                    if (this.merchant_id_zarinpal) {
                        this.show_alert = true
                    }
                    if (check_step) {
                        if (this.enamad_code) {
                            this.step = 3
                        } else if (this.shop_name) {
                            this.step = 2
                        } else {
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
            });
        },
        async updateData() {

            this.fd = new FormData();

            this.fd.append("name", this.shop_name)
            this.fd.append("username", this.shop_id)
            this.fd.append("image", this.logo)

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
                if (this.merchant_id_zarinpal) {
                    this.show_alert = true
                }

            }).catch(function (error) {


            })

        },
        async createData() {
            const userStore = useUserStore();
            this.fd = new FormData();

            this.fd.append("name", this.shop_name)
            this.fd.append("bio", this.shop_bio)
            this.fd.append("username", this.shop_id)
            this.fd.append("image", this.logo)

            await axios.post(
                `${apiStore().address}/api/account/seller-panel/init-shop/`,
                this.fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${useUserStore().userToken}`
                    },
                }
            ).then((response) => {
                
                userStore.saveStatusAndShopUsername('s', this.shop_id);
                this.$router.push('/');

            }).catch(function (error) {
                if (error.response) {
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
<style>
.negative-margin {
    margin-bottom: -17px;
    width: 98%;
    /* Default to a relatively narrow width */
}

.custom-stepper .v-stepper-header {
    box-shadow: none !important;
    border-bottom: solid 1px rgb(229, 229, 229);
}
</style>
