
<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        {{ snackbarMessage }}
    </v-snackbar>
    <v-container>
        <form @submit.prevent="updateData">
            <v-locale-provider rtl>



                <v-text-field 
                    label="نام فروشگاه" 
                    v-model="name" 
                    rounded="lg" 
                    required 
                    persistent-hint 
                    variant="outlined"
                    color="primary" 
                    class="mt-10" />

                <v-textarea 
                    color="primary" 
                    v-model="bio" 
                    rounded="lg" 
                    variant="outlined" 
                    label="اطلاعات فروشگاه"/>

                
                <v-file-input 
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint  
                    variant="outlined" 
                    color="primary"
                    v-model="image" 
                    @change="imageChange"
                    placeholder="Upload your documents" 
                    prepend-icon="" 
                    label="تغییر عکس‌ پروفایل فروشگاه">

                    <template v-slot:prepend>
                        <PhotoIcon  class="text-grey" />
                    </template>

                </v-file-input>

                <div  
                    v-if="image_preview" 
                    class="image-preview-container ps-10">

                    <img :src="image_preview" class="chip-image-preview" />
                </div>

                <v-file-input 
                    rounded="lg" 
                    accept=".png,.jpg" 
                    persistent-hint  
                    variant="outlined" 
                    color="primary"
                    v-model="background_image" 
                    @change="backgroundImageChange"
                    placeholder="Upload your documents" 
                    prepend-icon="" 
                    label="تغییر عکس‌ زمینه پروفایل فروشگاه">

                    <template v-slot:prepend>
                        <PhotoIcon  class="text-grey" />
                    </template>
                  
                </v-file-input>

                
                <div  
                    v-if="background_image_preview" 
                    class="image-preview-container ps-10">

                    <img :src="background_image_preview" class="chip-image-preview-ultra-wide" />
                </div>
                <v-checkbox v-model="is_background_blur" color="primary" label="بلور بودن بکگراند" class="flex-grow-1"/>


                <p class="text-8xl pt-5 pb-3 text-grey-darken-2" >
                    راه ارتباطی با شبکه های اجتماعی:
                </p>
                <v-alert  border="start" class="mb-10 rtl ">
                    <div class="pa-2">

                       در این قسمت   تنها ایدی را قرار دهید و از قرار دادن لینک خودداری کنید.
                    </div>
                </v-alert>
                <v-text-field 
                    color="primary" 
                    v-model="telegram" 
                    placeholder="telegram_id"
                    rounded="lg" 
                    variant="outlined" 
                    label="آیدی تلگرام"/>

                <v-text-field 
                    color="primary" 
                    v-model="whatsapp" 
                    placeholder="989123334444+"
                    rounded="lg" 
                    variant="outlined" 
                    label="شماره واتساپ"/>

                <v-text-field 
                    color="primary" 
                    v-model="instagram"
                    placeholder="instagram_id" 
                    rounded="lg" 
                    variant="outlined" 
                    label="آیدی اینستاگرام"/>
                <v-text-field 
                    color="primary" 
                    v-model="eitaa"
                    placeholder="eitaa_id" 
                    rounded="lg" 
                    variant="outlined" 
                    label="آیدی ایتا"/>
                <v-text-field 
                    color="primary" 
                    v-model="rubika"
                    placeholder="rubika_id" 
                    rounded="lg" 
                    variant="outlined" 
                    label="آیدی روبیکا"/>

                <v-text-field 
                    color="primary" 
                    v-model="twitter" 
                    placeholder="X_id" 
                    rounded="lg" 
                    variant="outlined" 
                    label="آیدی ایکس"/>


            </v-locale-provider>

            <v-btn 
                :loading="loading" 
                type="submit" 
                rounded="lg" 
                persistent-hint 
                variant="flat" 
                color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" >
                
                ثبت

            </v-btn>

        </form>

        <v-divider class="my-10" />
        <section class="rtl">
            <h2 class="text-h5 font-weight-bold text-error mb-3">بستن فروشگاه</h2>
            <p class="text-body-2 mb-5">با بستن فروشگاه، پروفایل و محصولات شما از نمایش عمومی خارج می‌شوند. سفارش‌های قبلی و کیف پول همچنان در دسترس می‌مانند.</p>
            <v-alert v-if="!shopLifecycle.is_active" type="warning" variant="tonal" class="mb-4">
                فروشگاه شما غیرفعال است. سفارش‌های قبلی، کیف پول و گزارش‌های مالی همچنان در دسترس هستند.
            </v-alert>
            <v-btn v-if="shopLifecycle.is_active" color="error" variant="outlined" @click="deactivateDialog = true">غیرفعال کردن فروشگاه</v-btn>
            <v-btn v-else color="success" variant="flat" :loading="activating" @click="activateShop">فعال‌سازی مجدد فروشگاه</v-btn>
            <v-alert v-if="lifecycleActionError" type="error" variant="tonal" class="mt-4">{{ lifecycleActionError }}</v-alert>
        </section>

        <v-dialog v-model="deactivateDialog" max-width="520">
            <v-card class="rtl pa-3" title="تأیید بستن فروشگاه">
                <v-card-text>
                    <p class="mb-4">این عمل باعث حذف فروشگاه از بخش عمومی و توقف مدیریت کاتالوگ می‌شود.</p>
                    <v-textarea v-model="deactivationReason" label="علت بستن (اختیاری)" variant="outlined" />
                    <v-alert v-if="deactivationError" type="error" variant="tonal">{{ deactivationError }}</v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="deactivateDialog = false">انصراف</v-btn>
                    <v-btn color="error" :loading="deactivating" @click="deactivateShop">تأیید بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
            snackbar:false,
            loading: true,
            image: null,
            background_image: null,
            is_background_blur: false,
            name: "",
            bio: "",
            instagram: "",
            eitaa: "",
            rubika: "",
            twitter: "",
            telegram: "",
            whatsapp: "",

            id : null,
      
            image_preview: null,
            background_image_preview: null,
            shopLifecycle: useUserStore().shopLifecycle,
            deactivateDialog: false,
            deactivationReason: '',
            deactivationError: '',
            deactivating: false,
            activating: false,
            snackbarMessage: 'اطلاعات با موفقیت ویرایش شد',
            lifecycleActionError: '',
        };
    },
    mounted() {
        this.getData()
    },
    methods: {
        imageChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'image_preview');
        },
        backgroundImageChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'background_image_preview');
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
            axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                useUserStore().setShopLifecycle(response.data[0])
                this.shopLifecycle = useUserStore().shopLifecycle
                this.loading = false
                this.id = response.data[0].id
                this.name = response.data[0].name
                this.bio = response.data[0].bio
                this.image_preview = response.data[0].image
                this.background_image_preview = response.data[0].background_image
                this.instagram = response.data[0].instagram
                this.is_background_blur = response.data[0].is_background_blur
                this.eitaa = response.data[0].eitaa
                this.rubika = response.data[0].rubika
                this.twitter = response.data[0].twitter
                this.telegram = response.data[0].telegram
                this.whatsapp = response.data[0].whatsapp
            }
            )
        },
        async deactivateShop() {
            this.deactivating = true
            this.deactivationError = ''
            this.lifecycleActionError = ''
            try {
                const reason = this.deactivationReason.trim()
                const response = await axios.post(`${apiStore().address}/api/account/seller-panel/deactivate-shop/`, reason ? { reason } : {}, { headers: { Authorization: `Token ${useUserStore().userToken}` } })
                useUserStore().setShopLifecycle(response.data)
                this.shopLifecycle = useUserStore().shopLifecycle
                this.deactivateDialog = false
                this.deactivationReason = ''
                this.snackbarMessage = 'فروشگاه با موفقیت غیرفعال شد'
                this.snackbar = true
            } catch (error) {
                this.deactivationError = error.response?.data?.error || 'بستن فروشگاه انجام نشد. لطفاً دوباره تلاش کنید.'
            } finally {
                this.deactivating = false
            }
        },
        async activateShop() {
            this.activating = true
            this.lifecycleActionError = ''
            try {
                const response = await axios.post(`${apiStore().address}/api/account/seller-panel/activate-shop/`, null, {
                    headers: { Authorization: `Token ${useUserStore().userToken}` },
                })
                useUserStore().setShopLifecycle(response.data)
                this.shopLifecycle = useUserStore().shopLifecycle
                this.snackbarMessage = 'فروشگاه با موفقیت فعال شد'
                this.snackbar = true
            } catch (error) {
                this.lifecycleActionError = error.response?.data?.error || 'فعال‌سازی فروشگاه انجام نشد. لطفاً دوباره تلاش کنید.'
            } finally {
                this.activating = false
            }
        },
        async updateData() {
            this.loading = true
            
            this.fd = new FormData();
                if(this.image)  this.fd.append("image", this.image)
                if(this.background_image)  this.fd.append("background_image", this.background_image)
                this.fd.append("name", this.name);
                this.fd.append("bio", this.bio);
                this.fd.append("is_background_blur", this.is_background_blur);
                this.fd.append("instagram", this.instagram);
                this.fd.append("eitaa", this.eitaa);
                this.fd.append("rubika", this.rubika);
                this.fd.append("twitter", this.twitter);
                this.fd.append("telegram", this.telegram);
                this.fd.append("whatsapp", this.whatsapp);
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
