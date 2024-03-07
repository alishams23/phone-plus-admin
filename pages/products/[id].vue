<template>
    <v-container>

        <form @submit.prevent="sendData" class="px-md-10">
            <v-locale-provider rtl>
                <v-text-field label="نام محصول" v-model="title" rounded="lg" required persistent-hint variant="outlined"
                    color="primary" class="mt-10" />
                <div class="px-5 py-3 ">
                    توضیحات محصول
                </div>
            </v-locale-provider>
            <TextEditor :content="description" @update="handleTextChange"></TextEditor>
            <v-locale-provider rtl>
                <v-row class="mt-10 mb-5">
                    <v-col>
                        <v-text-field label="قیمت محصول" v-model="price" required rounded="lg" type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col>
                        <v-autocomplete label="دسته بندی‌ها" rounded="lg" persistent-hint variant="outlined" color="primary"
                            clearable chips v-model="selectedCategories" :items="categories" item-text="name"
                            item-value="id" multiple>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-file-input rounded="lg" accept=".png,.jpg" persistent-hint @change="sendImage" variant="outlined"
                    :disabled="loadingImage" color="primary" v-model="images" placeholder="Upload your documents"
                    label="عکس‌های محصول" multiple>
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
                <div class="d-flex flex-wrap">
                    <!-- <template v-for="(preview, index) in imagePreviews" :key="index">
                        <v-img cover :src="preview" class="chip-image-preview" :aspect-ratio="1 / 1" />
                    </template> -->
                    <div class="image-preview-container">
                        <template v-for="(preview, index) in imagePreviews" :key="index">
                            <v-img :src="preview" class="chip-image-preview"></v-img>
                        </template>
                    </div>
                    <div class="image-preview-container">
                     
                        <template v-for="(preview, index) in imageUrl" :key="index">

                            <v-img :src="address + '/api/product/product-image/'+preview+'/ '" class="chip-image-preview"><v-avatar size="30" class="ma-3"
                                @click="imageIds.splice(imageIds.indexOf(preview), 1); imageUrl.splice(index, 1)"
                                color="red-darken-2" icon="">
                                <TrashIcon size="15" />
                            </v-avatar></v-img>
                        </template>
                    </div>
                </div>

                <v-text-field
                label="ویدیو محصول"
                v-model="video"
                rounded="lg"

                variant="outlined"
                color="primary"
                class="mt-10"/>
                <v-checkbox v-model="discount" @click="discount == false? value=0:''" color="primary" label="دارای تخفیف">
                </v-checkbox>

            </v-locale-provider>

            <v-slide-y-transition>
                <v-slider v-if="discount" label="درصد تخفیف" variant="outlined" color="primary" class="mt-5" v-model="value"
                    :min="0" :max="100" :step="1" thumb-label></v-slider>
            </v-slide-y-transition>
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
<script>
import { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon } from 'vue-tabler-icons';
import TextEditor from '@/components/shared/TextEditor.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
    components: { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon, TextEditor },
    computed:{
        address(){
            return apiStore().address
        }
    },
    data: () => ({
        price: 0,
        title: null,
        description: null,
        discount: false,
        images: [],
        imageUrl: [],
        video: null,
        value: 0,
        imageIds: [],
        loadingImage: false,
        imagePreviews: [],
        categories: [],
        selectedCategories: [],
    }),
    mounted() {
        this.fetchCategories();
        this.getData()
    },
    methods: {
        handleTextChange(newText) {
            this.description = newText;
        },
        async fetchCategories() {
            try {
                const userToken = useUserStore().userToken; // Get the token from your user store
                const response = await axios.get(`${apiStore().address}/api/product/ListCategories/`, {
                    headers: {
                        Authorization: `Token ${userToken}`
                    }
                });
                this.categories = response.data; // Assuming the API returns an array
                console.log('categories', this.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async sendDataFunc() {
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();
                    imageFormData.append(`photo`, file);
                    try {
                        axios.post(`${apiStore().address}/api/product/admin/add-image/`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }).then((data) => {
                            this.imageIds.push(data.data.id)

                        })
                    } catch (error) {
                        console.error('Error uploading images:', error);
                        return;
                    }
                    return
                })
            }
        },
        async sendImage() {
            this.loadingImage = true;
            this.imagePreviews = [];
            this.images.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
            this.sendDataFunc();
            this.loadingImage = false;
        },
        async sendData() {
            console.log(this.selectedCategories)
            let formDic = {}
            formDic['category'] = this.selectedCategories
            formDic['image'] = this.imageIds
            formDic['video'] = this.video
            formDic['title'] = this.title
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value

            axios.put(`${apiStore().address}/api/product/admin/product-retrieve-update-destroy/${this.$route.params.id}/`, formDic, {
                headers: {
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.$router.push(`/products`);
                    // handle success
                    console.log(response.data);
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/admin/product-retrieve-update-destroy/${this.$route.params.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {

                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                response.data.image.forEach(element => {

                    this.imageIds.push(element)
                });
                response.data.image.forEach(element => {

                    this.imageUrl.push(element)
                });
                this.selectedCategories = response.data.category
           
                console.log(this.categories);
                this.price = response.data.price
                this.value = response.data.discount
                if (response.data.discount) this.discount = true

            }
            )
        },
    }
};
</script>

<style >
.ql-toolbar.ql-snow {
    border-radius: 13px 13px 0px 0px !important;
}
</style>