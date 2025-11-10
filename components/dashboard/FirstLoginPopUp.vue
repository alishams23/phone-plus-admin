
<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        اطلاعات با موفقیت ویرایش شد
    </v-snackbar>

    <v-overlay
      :model-value="overlay"
      class="align-center justify-center ">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-progress-circular color="primary" size="32" indeterminate></v-progress-circular>
          </v-col>
            <p class="text-center text-white">!لطفا دوباره وارد شوید</p>
        </v-row>
      </v-container>
    </v-overlay>
    
    <form @submit.prevent="updateData">
        <p class="mt-10 rtl text-black" >
            به وبسایت فون‌پلاس خوش‌آمدید
        </p>
        <p class="mt-2 rtl text-body-2" >
            لطفا اطلاعات فروشگاه خود را ثبت کنید:
        </p>
        <v-locale-provider rtl>
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-text-field  
                        v-model="username"   
                        label="آیدی فروشگاه"  
                        :rules="usernameRules"   
                        rounded="lg"  
                        required
                        persistent-hint    
                        variant="outlined" 
                        color="primary"/>
                </v-col>
            </v-row>
            <v-row class="mb-4">
                <v-col cols="12">
                    <v-alert v-if="usernameExists !== null && isValidUsername(username)" 
                        variant="tonal"
                        :type="alertType">
                        {{ alertMessage }}
                    </v-alert>
                </v-col>
            </v-row>

            <v-text-field 
                label="نام فروشگاه" 
                v-model="name" 
                rounded="lg" 
                required 
                persistent-hint 
                variant="outlined"
                color="primary" 
                class="-mt-2" />

            <v-textarea 
                color="primary" 
                v-model="bio" 
                rounded="lg" 
                variant="outlined" 
                label="بیو"/>

            <v-file-input 
                rounded="lg" 
                accept=".png,.jpg" 
                persistent-hint  
                variant="outlined" 
                v-model="image"
                @change="handleImageChange"
                color="primary"
                placeholder="عکس‌ پروفایل فروشگاه" 
                label="تغییر عکس‌ پروفایل فروشگاه">

                <template v-slot:prepend>
                    <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                </template>
            </v-file-input>
            

            <div v-if="image==null" class="image-preview-container">
                <div>
                    <v-img :src="last_image"
                        class="chip-image-preview object-cover ">
                    </v-img>
                </div>
            </div>
            <div v-else class="image-preview-container ">
                <img :src="image_preview" class="chip-image-preview" />
            </div>

        </v-locale-provider>

        <v-btn 
            rounded="lg" 
            persistent-hint 
            variant="flat" 
            color="primary" 
            :disabled="loading"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5" 
            type="submit">
            انجام شد
        </v-btn>

        <v-btn 
            rounded="lg" 
            persistent-hint 
            variant="outline" 
            color="primary" 
            :disabled="loading"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5" 
            @click="$emit('cancel')">
            بعدا یادآوری کن
        </v-btn>
    </form>
</template>

<script>
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import { PhotoIcon, VideoIcon, FileImportIcon, TrashIcon } from 'vue-tabler-icons';
export default {
    components: {
        PhotoIcon, VideoIcon, FileImportIcon, TrashIcon
    },
    emits:["cancel"],
    data() {
        return {
            data: null,
            is_first_login: null,
            id : null,
            image: null,
            image_preview:null,
            last_image: null,
            name: "",
            bio: "",
            snackbar:false,
            username: useUserStore().usernameShop,
            usernameExists: null,
            alertType: '',
            alertMessage: '',
            loading: false,
            overlay: false
        };
    },
    methods: {
        handleImageChange(event) {
            const files = event.target.files;
            this.previewImage(files, 'image_preview');
        },
        previewImage(files, previewTarget) {
            if (!files || !files[0]) return;
            const reader = new FileReader();
            reader.onload = e => {
                this[previewTarget] = e.target.result;
            };
            reader.readAsDataURL(files[0]);
        },
        async changeUserName() {
            this.username = this.username.toLowerCase();
            this.loading = true
            await axios.put(`${apiStore().address}/api/account/seller-panel/change-username-shop/`, { username: this.username }, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then(response => {
                // this.snackbar = true
                const userStore = useUserStore();
                userStore.setNewShopUsername(this.username);
                window.location.reload(true)

                this.loading = false
                
            }).catch(error => {
                console.error('Error checking username:', error);
                this.loading = false
            });
        },
        setAlertMessage() {
            if (this.usernameExists == true) {
                if (this.usernameExists == this.username.toLowerCase()) {
                this.alertType = 'error';
                this.alertMessage = 'این آیدی قبلا گرفته شده است';
                }else {
                this.alertType = 'info';
                this.alertMessage = 'این آیدی از قبل برای شما ثبت شده';
                }
            } else {
                this.alertType = 'success';
                this.alertMessage = 'این آیدی قابل استفاده است';
            }
        },
        isValidUsername(username) {
            // Regex for disallowed characters.
            const disallowedCharsRegex = /[!@#$%^&*()\-\+?=,<>'/]/;
            // Regex for allowing lowercase English letters and numbers.
            const allowedCharsRegex = /^[a-z0-9]+$/;
            // Check that the username is at least 6 characters long.
            const isLengthValid = username.length >= 6;

            // The username must pass the length check, not contain disallowed characters,
            // and match the allowed characters regex.
            return isLengthValid && !disallowedCharsRegex.test(username) && allowedCharsRegex.test(username);
        },
        async checkUsername() {
            this.username = this.username.toLowerCase();

            this.loading = true
            if (this.username.length >= 6) {
                await axios.post(`${apiStore().address}/api/account/seller-panel/check-username-shop/`, { username: this.username }, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },

                })
                .then(response => {
                    this.usernameExists = response.data.exists;
                    this.setAlertMessage();
                    this.loading = false

                })
                .catch(error => {
                    console.error('Error checking username:', error);
                });
            }
        },
        getData() {
            axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading = false
                this.data = response.data[0]
                this.is_first_login = response.data[0].is_first_login
                this.name = response.data[0].name
                this.bio = response.data[0].bio
                this.id = response.data[0].id
                this.last_image = response.data[0].image
            })
        },
        updateData(){
            this.loading = true
            this.fd = new FormData();
            if(this.image)  this.fd.append("image", this.image[0])
            this.fd.append("name", this.name);
            this.fd.append("bio", this.bio);
            this.fd.append("is_first_login", false);
            axios.patch(
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
                    // window.location.reload(true)
                    this.loading = false
                    this.changeUserName()
                }, 3000);
            })
        }
    }, 
    mounted() {
        this.getData()
    },
    watch: {
        overlay (val) {
            val && setTimeout(() => {
                this.overlay = false
            }, 3000)
        },
        username: {
            handler: function (val, oldVal) {
                this.checkUsername()
            },

        },
    },
    computed: {
        usernameRules() {
        return [
            v => !!v || 'یوزرنیم اجباری است',
            v => this.isValidUsername(v) || 'یوزرنیم حداقل باید شامل ۶ کاراکتر باشد و شامل کارکتر های !@#$%^&*()-+?=,<>/ و حروف فارسی نباشد ',
        ];
        },
    },
};
</script>
<style scoped>
.overlay
{
    background-color: rgba(145, 150, 158, 0.6);
    backdrop-filter: blur(1px);
}
</style>
