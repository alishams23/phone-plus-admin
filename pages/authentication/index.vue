<template>
    <v-container>
        <form  @submit.prevent="createData">
            <v-locale-provider rtl>
                {{ profile }}
                <v-file-input 
                    required
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint 
                    variant="outlined"
                    color="primary" 
                    v-model="profile" 
                    placeholder="Upload your documents"
                    label="پروفایل فروشگاه" 
                    class="mt-10">
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    
                </v-file-input>

                <v-text-field 
                    label="نام فروشگاه" 
                    v-model="shop_name"  
                    rounded="lg"    
                    required    
                    persistent-hint 
                    variant="outlined"
                    color="primary" />


                <v-file-input  
                    required
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint 
          
                    variant="outlined"
         
                    color="primary" 
                    v-model="N_card" 
                    placeholder="Upload your documents"
                    label="عکس کارت ملی" 
                    >
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    
                </v-file-input>

                <v-file-input 
                    required 
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint 
              
                    variant="outlined"
               
                    color="primary" 
                    v-model="N_card_face" 
                    placeholder="Upload your documents"
                    label=" عکس کارت ملی خود را در مجاور خود گرفته به صورتی که واضح باشد  " 
                    >
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    
                </v-file-input>
                
                <v-file-input 
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint 
                 
                    variant="outlined"
               
                    color="primary" 
                    v-model="shop_card" 
                    placeholder="Upload your documents"
                    label=" کارت مغازه " 
                    >
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    
                </v-file-input>

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
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
        <v-alert 
            color="info" 
            icon="fa fa-info" 
            variant="tonal"
            rounded="lg"
            class="rtl border-opacity-100 my-3">

            <div class="text-sm  font-weight-black irsa">
                پس از ثبت اطلاعات منتظر پیامک تایید بمانید 
            </div>
        </v-alert>
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
            loading: false,
            loadingImage: false,
            loadingData: true,

            profile: null,
            shop_name: null,
            N_card: null,
            N_card_face: null,
            shop_card: null,
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
        // this.getData()
    },
    methods: {
        getData() {
            axios.get(`${apiStore().address}/api/account/admin/verify-shop-retrieve-update/<int:pk>/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log(response)
                // this.loadingData = false
                // this.name = response.data[0].name
                // this.bio = response.data[0].bio
                // this.image = response.data[0].image
            }
            )
        },
        async updateData() {
            this.fd = new FormData();
            if (this.image) {
                this.fd.append("image", this.profile[0])
                this.fd.append("name", this.shop_name)
                this.fd.append("image_national_card", this.N_card)
                this.fd.append("selfie_with_national_card", this.N_card_face)
                this.fd.append("shop_card", this.shop_card)
                this.fd.append("merchant_zarin", this.merchant_id_zarinpal)

                console.log(this.image)
                await axios
                    .put(
                        `${apiStore().address}/api/account/admin/verify-shop-retrieve-update/<int:pk>/`,
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
                      

                    })
            } else {
                return null
            }
        },
        async createData() {
            console.log('createData');
            this.fd = new FormData();

                this.fd.append("image", this.profile[0])
                this.fd.append("name", this.shop_name)
                this.fd.append("image_national_card", this.N_card[0])
                this.fd.append("selfie_with_national_card", this.N_card_face[0])
                this.fd.append("shop_card", this.shop_card[0])
                this.fd.append("merchant_zarin", this.merchant_id_zarinpal)

                await axios
                    .post(
                        `${apiStore().address}/api/account/admin/verify-shop-create/`,
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
                      

                    })

        },

    },
}
</script>