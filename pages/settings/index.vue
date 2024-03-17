
<template>
    <v-container>
        <form @submit.prevent="updateData">
            <v-locale-provider rtl>
                <v-text-field label="نام فروشگاه" v-model="name" rounded="lg" required persistent-hint variant="outlined"
                    color="primary" class="mt-10" />
                <v-textarea color="primary" v-model="bio" rounded="lg" variant="outlined" label="بیو"></v-textarea>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint  variant="outlined" color="primary"
                    v-model="image" placeholder="Upload your documents" label="تغییر عکس‌ پروفایل فروشگاه">
                    <template v-slot:prepend>
                        <PhotoIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                  
                </v-file-input>
 
            </v-locale-provider>
            <v-btn :loading="loading" type="submit" rounded="lg" persistent-hint variant="flat" color="primary"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" >
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
            loading: true,
            image: null,
            name: "",
            bio: "",
            id : null,
      
            imagePreviews: [],
        };
    },
    mounted() {
        this.getData()
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
                this.loading = false
                this.name = response.data[0].name
                this.bio = response.data[0].bio
                this.id = response.data[0].id
            }
            )
        },
        async updateData() {
            this.loading = true

            this.fd = new FormData();
                if(this.image)  this.fd.append("image", this.image[0])
                this.fd.append("name", this.name);
                this.fd.append("bio", this.bio);
                console.log(this.image)
                await axios
                    .patch(
                        `${apiStore().address}/api/account/admin/shop-update/${this.id}/`,
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
                        window.location.reload(true)
                        this.loading = false
                    })
           
        },

    },
}
</script>