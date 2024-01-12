<script >
import { PhotoIcon, } from 'vue-tabler-icons';
import axios from 'axios';
import { useUserStore } from '~/store/user';

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
        this.getData()
    },
    methods: {
        getData() {
            axios.get(`http://192.168.1.106:8000/api/account/shop-retrieve/`, {
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
                        `http://192.168.1.106:8000/api/account/shop-update/`,
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
<template>
    <v-container>
        <form>
            <v-locale-provider rtl>
                <v-text-field label="نام فروشگاه" v-model="name" rounded="lg" required persistent-hint variant="outlined"
                    color="primary" class="mt-10" />
                <v-textarea color="primary" rounded="lg" variant="outlined" label="بیو"></v-textarea>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint required variant="outlined" color="primary"
                    v-model="image" placeholder="Upload your documents" label="عکس‌ پروفایل فروشگاه">
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
                <div class="image-preview-container">
                    <template v-for="(preview, index) in imagePreviews" :key="index">
                        <img :src="preview" class="chip-image-preview" />
                    </template>
                </div>
            </v-locale-provider>
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
