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
                    <v-col cols="12" md="6">
                        <v-text-field
                            label="قیمت"
                            rounded="lg"
                            v-model="price"
                            required
                            type="number"
                            persistent-hint
                            variant="outlined"
                            color="primary"/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <AddCategories @change="(data) => {selectedCategories = data }" :selected="selectedCategories" url="/api/product/admin/category-digital-product-list-create/" />
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
                     
                        <template v-for="(preview, index) in imageIds" :key="index">
                          
                            <v-img :src="address + '/api/product/product-image/'+preview+'/ '" class="chip-image-preview"><v-avatar size="30" class="ma-3"
                                @click="imageIds.splice(imageIds.indexOf(preview), 1); imageIds.splice(index, 1)"
                                color="red-darken-2" icon="">
                                <TrashIcon size="15" />
                            </v-avatar></v-img>
                        </template>
                    </div>
                </div>

                <v-combobox
                    rounded="lg"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    disabled
                    :label="get_file? 'فایل زیپ' : 'لیست لایسنس‌ها'"
                    :items="['لیست لایسنس‌ها', 'فایل زیپ']"
                ></v-combobox>

                <v-file-input
                    rounded="lg"
                    accept=".zip,.rar"
                    persistent-hint
                    variant="outlined"
                    color="primary"
                    v-if="get_file"
                    v-model="file"
                    placeholder="اضافه کردن فایل"
                    label="فایل محصول"
                    >
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                            <template v-for="fileName in fileNames" :key="fileName">
                                <v-chip
                                size="small"
                                label
                                color="primary"
                                >
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>
                <v-file-input
                        rounded="lg"
                        accept=".csv"
                        persistent-hint
                        variant="outlined"
                        color="primary"
                        v-if="get_file==null"
                        @change="handleCsvUpload"
                        v-model="file"
                        placeholder="اضافه لیست"
                        label="لیست محصول"
                        >
                        <template v-slot:prepend>
                            <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
                        </template>
                        <template v-slot:selection="{ fileNames }">
                                <template v-for="fileName in fileNames" :key="fileName">
                                    <v-chip
                                    size="small"
                                    label
                                    color="primary"
                                    >
                                    {{ fileName }}
                                </v-chip>
                            </template>
                        </template>
                </v-file-input>
                <v-table  fixed-header>
                    <tbody>
                        <tr v-for="items in transformedData" :key="items">
                            <td class="bg-grey-lighten-5 rounded-pill text-center" v-for="item in items">{{ item.title }} : {{ item.body }}</td>
                            <v-btn class="mt-2" icon="" color="red" variant="tonal" size="small"
                                @click="transformedData.splice(transformedData.indexOf(items), 1)">
                                <TrashIcon size="18" />
                            </v-btn>
                        </tr>
                    </tbody>
                </v-table>
                <v-table  fixed-header>
                    <tbody>
                        <tr v-for="items in subset_product" :key="items" class="" >
                            <td class="bg-red-lighten-5 rounded-pill text-center" v-for="item in items.data">{{ item.title }} : {{ item.body }}</td>
                            <v-btn class="mt-2" icon="" color="red" variant="tonal" size="small"
                                @click="subset_product.splice(subset_product.indexOf(items), 1)">
                                <TrashIcon size="18" />
                            </v-btn>
                        </tr>
                    </tbody>
                </v-table>
                
                <v-alert
                    v-if="file_type=='لیست لایسنس‌ها'"
                    class="mt-2 rounded-lg"
                    title="نکته"
                    text="برای ثبت لایسنس‌های خود، لطفاً فایل CSV را با دقت تکمیل کنید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند."
                ></v-alert>
                <v-checkbox v-model="discount" @click="discount == false? value=0:''" color="primary" label="دارای تخفیف">
                </v-checkbox>

            </v-locale-provider>

            <v-slide-y-transition>
                <v-slider v-if="discount" label="درصد تخفیف" variant="outlined" color="primary" class="mt-5" v-model="value"
                    :min="0" :max="100" :step="1" thumb-label></v-slider>
            </v-slide-y-transition>
            <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage || imageIds.length==0"
                class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                ثبت
            </v-btn>
        </form>
    </v-container>
</template>
<script>
import Papa from 'papaparse';
import { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon } from 'vue-tabler-icons';
import TextEditor from '@/components/shared/TextEditor.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import AddCategories from '@/components/section/product/AddCategories.vue';

export default {    
    components: { PhotoIcon, VideoIcon, CheckboxIcon, TrashIcon, TextEditor, AddCategories },
    computed:{
        address(){
            return apiStore().address
        },
        tableHeaders() {
            return this.csvData.length > 0 ? Object.keys(this.csvData[0]) : [];
        },
        tableHeadersGetData() {
            if (this.subset_product){
                return this.subset_product.length > 0 ? Object.keys(this.subset_product.data) : [];
            }
        },

    },
    data: () => ({
        price: 0,
        title: null,
        csvData: [],
        formattedDate:[],
        transformedData: [],    
        description: null,
        images: [],
        imageIds : [],
        loadingImage:false,
        imagePreviews: [], 
        categories: [],
        selectedCategories: [],
        file_type : null,
        subset_product : null,
        tab: null,
        discount: false,
        images: [],
        get_file: null,
        file: null,
        value: 0,
        body: '',
        editorOptions: {
            theme: "snow",
            rules: [
                files => !files || !files.some(file => file.size > 2_097_152) || 'Avatar size should be less than 2 MB!'
            ],
        }
    }),

    mounted() {
    
        this.getData()
    },
    methods: {
        handleTextChange(newText) {
          this.body = newText;
        },
        deleteRow(index) {
            this.csvData.splice(index, 1);
        },
        handleCsvUpload(event) {
            // Ensure a file was selected
            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0]; // Get the first file

            // Use FileReader to read the file
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;

                // Parse the CSV content
                Papa.parse(content, {
                    complete: (results) => {
                        this.csvData = results.data; // Assuming you want to store the raw data
                        this.transformedData = this.transformCSVData(results.data);
                        console.log(this.transformedData);
                        // Here you can update your data properties or methods as needed
                    },
                    header: true // This will use the first row as headers
                });
            };
            reader.readAsText(file);
        },
        
        transformCSVData(data) {
            return data.map(row => {
                return Object.keys(row).map(key => ({ title: key, body: row[key] }))
            })
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
            let subset = []
            this.subset_product.forEach((element) => {
                subset.push(element.id)
            })
            console.log(this.selectedCategories)
            let formDic = {}
            console.log(this.imageIds)
            formDic['image'] = this.imageIds
            formDic['title'] = this.title
            if(this.file != null)  formDic['file'] = this.file
            formDic['subsets_data'] = this.transformedData
            formDic['subset_product'] = subset
            formDic['description'] = this.description
            formDic['price'] = this.price
            formDic['discount'] = this.value

            axios.put(`${apiStore().address}/api/product/admin/digital-product-retrieve-update-destroy/${this.$route.params.id}/`, formDic, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.$router.push(`/digital_products`);
                    // handle success
                    console.log(response.data);
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/admin/digital-product-retrieve-update-destroy/${this.$route.params.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log('getData',response)
                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                response.data.image.forEach(element => {

                    this.imageIds.push(element.id)
                });
                console.log('images', this.imageIds);
                this.selectedCategories = response.data.category
           
                console.log(this.categories);
                this.price = response.data.price
                this.value = response.data.discount
                this.get_file = response.data.file
                this.subset_product = response.data.subset_product
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