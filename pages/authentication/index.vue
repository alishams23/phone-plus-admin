<template>
    <div v-if="loadingData" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <v-progress-circular 
        :size="55" 
        class="ma-10" 
        bg-color="grey4" 
        :width="7" 
        color="blue"
        indeterminate>
    </v-progress-circular>
</div>

    <div v-else>
        <v-container class="px-md-16">
            <v-alert border="start" class="rtl mt-2 rounded-lg" title="نکته"
                text="پروفایل شما به عنوان یک فروشنده تایید نشده است. شما ابتدا باید احراز هویت انجام داده و پس از آن میتوانید وارد پنل فروشندگان شوید.">
            </v-alert>
            <form  @submit.prevent="id!=null ? updateData() : createData()">
                <v-locale-provider rtl>
                    <v-text-field 
                        class="mt-16"
                        label="نام فروشگاه" 
                        v-model="shop_name"  
                        rounded="lg"    
                        required
                        persistent-hint 
                        variant="outlined"
                        color="primary" />

                    <v-file-input  
                        rounded="lg" 
                        accept=".png,.jpg" 
                        persistent-hint 
                        :required="N_card_preview? false : true"
                        variant="outlined"
                        color="primary" 
                        v-model="N_card" 
                        @change="handleNCardChange"
                        placeholder="Upload your documents"
                        label="عکس کارت ملی" 
                        >
                        <template v-slot:prepend>
                            <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                        </template>
                        
                    </v-file-input>
                    <div  v-if="N_card_preview" class="image-preview-container ps-10">
                        <img :src="N_card_preview" class="chip-image-preview" />
                    </div>
        
                    <v-file-input 
                        rounded="lg" 
                        accept=".png,.jpg" 
                        persistent-hint 
                        :required="N_card_face_preview? false : true"
                        variant="outlined"
                        color="primary" 
                        v-model="N_card_face" 
                        @change="handleNCardFaceChange"
                        placeholder="Upload your documents"
                        label=" عکس صورت همراه با کارت ملی " 
                        >
                        <template v-slot:prepend>
                            <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                        </template>
                        
                    </v-file-input>
                    <v-alert 
                        border="start"
                        color="warning" 
                        icon="fa fa-info" 
                        variant="tonal"
                        rounded="lg"
                        class=" border-opacity-100  pb-2 my-3 mb-4">
                        <div class="text-xs irsa">
                        <p class="text-right"> عکس کارت ملی خود را در مجاور خود گرفته به صورتی که واضح باشد  </p>
                        </div>
                    </v-alert>
                    <div v-if="N_card_face_preview" class="image-preview-container ps-10">
                        <img :src="N_card_face_preview" class="chip-image-preview" />
                    </div>
                    <v-file-input 
                        rounded="lg" 
                        accept=".png,.jpg" 
                        persistent-hint 
                        variant="outlined"
                        color="primary" 
                        v-model="shop_card" 
                        @change="handleShopCardChange"
                        placeholder="Upload your documents"
                        label=" کارت مغازه " 
                        >
                        <template v-slot:prepend>
                            <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                        </template>
                        
                    </v-file-input>
                    <div v-if="shop_card_preview" class="image-preview-container ps-10">
                        <img :src="shop_card_preview" class="chip-image-preview" />
                    </div>
        
                    <v-text-field 
                        label="مرچنت آیدی زرین‌پال" 
                        v-model="merchant_id_zarinpal"  
                        rounded="lg"    
                        required
                        persistent-hint 
                        variant="outlined"
                        color="primary" />
        
                </v-locale-provider>
                <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                    class="mx-2 px-5 text-body2 font-weight-bold mb-5" type="submit">
                    تایید قوانین و ثبت
                </v-btn>
            </form>
            <v-progress-linear
                indeterminate
                color="primary"
                rounded="lg"
                height="3"
                class="negative-margin"
            ></v-progress-linear>
            <v-alert 
                v-if="id"
                border="end"
                color="info" 
                icon="fa fa-info" 
                variant="tonal"
                rounded="lg"
                class="border-opacity-100  my-3"
                >
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

        </v-container>
    </div>
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
            loading: false,
            loadingImage: false,
            loadingData: true,
            id : null,
            is_verified : false,
            put_data: false,

            shop_name: null,

            N_card: null,
            N_card_preview: null,

            N_card_face: null,
            N_card_face_preview: null,

            shop_card: null,
            shop_card_preview: null,

            merchant_id_zarinpal: null,


            imagePreviews: [],
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
        getData() {
            this.loadingData = true
            console.log('getData');
            axios.get(`${apiStore().address}/api/account/seller-panel/verify-shop-list`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log('Data',response.data[0])
                if (response.data.length){
                    this.id                     = response.data[0].id;
                    this.is_verified            = response.data[0].is_verified;
                    this.shop_name              = response.data[0].name;
                    this.N_card_preview         = response.data[0].image_national_card;
                    this.N_card_face_preview    = response.data[0].selfie_with_national_card;
                    this.shop_card_preview      = response.data[0].shop_card;
                    this.merchant_id_zarinpal   = response.data[0].merchant_zarin;
                    this.put_data = true
                }
                if (this.is_verified){
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
            this.N_card? this.fd.append("image_national_card", this.N_card[0]) : ''
            this.N_card_face? this.fd.append("selfie_with_national_card", this.N_card_face[0]) : ''
            this.shop_card? this.fd.append("shop_card", this.shop_card[0]) : ''
            this.fd.append("merchant_zarin", this.merchant_id_zarinpal)

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
                this.getData()

            }).catch(function (error) {
                 
                console.log('error', error);
                
            })

        },
        async createData() {
            console.log('createData');
            this.fd = new FormData();

            this.fd.append("name", this.shop_name)
            this.fd.append("image_national_card", this.N_card[0])
            this.fd.append("selfie_with_national_card", this.N_card_face[0])
            this.fd.append("shop_card", this.shop_card[0])
            this.fd.append("merchant_zarin", this.merchant_id_zarinpal)

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
                this.get
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                }
            })

        },
    },
}
</script>
<style scoped>
.negative-margin {
  margin-bottom: -17px; 
  width: 98%; /* Default to a relatively narrow width */
}
</style>
