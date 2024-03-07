<template>
    <v-container>
        <form class="mt-10">
            <v-locale-provider rtl>
                <v-alert rounded="lg" border="start mb-10 ">
                    <div class="pa-3">
                        کاربر گرامی بعد از خواندن مقررات فایل زیر را دانلود کرده و مطابق عکس از خود در کنار کاغذ چاپ شده
                        فایل زیر و کارت ملی یا شناسنامه ی خود عکس بگیرید

                    </div>
                    <div class="mt-5">
                        <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                            class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                            دانلود فایل
                        </v-btn>
                    </div>
                </v-alert>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint required variant="outlined" color="primary"
                    v-model="image" placeholder="Upload your documents" label="عکس‌ کاربر به همراه متن قبول مقررات">
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="(preview, index) in imagePreviews" :key="index">
                            <v-chip class="mx-1" size="small" label color="primary">
                                {{ fileNames[index] }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint required variant="outlined" color="primary"
                    v-model="image" placeholder="Upload your documents" label="مجوز کسب">
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="(preview, index) in imagePreviews" :key="index">
                            <v-chip class="mx-1" size="small" label color="primary">
                                {{ fileNames[index] }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>
            </v-locale-provider>
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
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
            loading: false,
            image: null,
            name: "",
            bio: "",

            loadingData: true,
            imagePreviews: [],
        };
    },
    mounted() {

    },
    methods: {
        getData() {
            axios.get(`${apiStore().address}/api/account/admin/shop-retrieve/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log(response)
                this.loadingData = false
                this.name = response.data[0].name
                this.bio = response.data[0].bio
                this.image = response.data[0].image
            }
            )
        },
        async sendData() {
            this.fd = new FormData();
            if (this.image) {
                this.fd.append("image", this.image)
                this.fd.append("name", this.name);
                this.fd.append("bio", this.bio);
                console.log(this.image)
                await axios
                    .put(
                        `${apiStore().address}/api/account/admin/shop-update/`,
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

    },
}
</script>