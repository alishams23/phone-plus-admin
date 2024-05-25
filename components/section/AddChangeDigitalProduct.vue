<template>
    <v-btn rounded="pill" icon variant="outline" color="primary" :disabled="loadingImage"
        class="text-body2 hidden-sm-and-down font-weight-bold fixed-top-left" @click="$emit('cancel')">
        <XIcon size="24" />
    </v-btn>
    <v-btn rounded="pill" icon variant="outline" color="primary" :disabled="loadingImage"
        class="text-body2 font-weight-bold hidden-md-and-up" @click="$emit('cancel')">
        <XIcon size="24" />
    </v-btn>

    <div>
        <v-snackbar
            :timeout="2000"
            color="red"
            variant="flat"
            elevation="24"
            v-model="snackbar_delete">
            <div class="w-100 rtl">
                <p>با موفقیت حذف شد</p>
            </div>
            <template v-slot:actions>
                <v-btn
                color="red"
                variant="text"
                @click="snackbar_delete = false">
                <XIcon/>
                </v-btn>
            </template>
        </v-snackbar>
        <form @submit.prevent="sendData">
            <v-locale-provider rtl>
                <v-text-field label="نام" rounded="lg" persistent-hint variant="outlined" color="primary" class="mt-md-10"
                    v-model="title" required />
            </v-locale-provider>
            <TextEditor :content="description" @update="handleTextChange"></TextEditor>

            <v-locale-provider rtl>
                <v-row class="mt-10 mb-5">
                    <v-col cols="12" md="6">
                        <v-text-field :label="file_type=='لیست لایسنس اکانت کد یکتا' || file_type=='لایسنس اکانت کد یکتا'?' قیمت هر ردیف(تومان)':'قیمت(تومان)'" rounded="lg" v-model="price" required type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <AddCategories @change="(data) => { selectedCategories = data }" :selected="selectedCategories"
                            url="/api/product/seller-panel/category-digital-product-list-create/" />
                    </v-col>
                </v-row>
                <v-file-input :loading="loadingImage" :disabled="loadingImage" rounded="lg" accept=".png,.jpg" :rules="rules" :required="id?imageIds.length!=0?false:true:true" multiple persistent-hint
                    variant="outlined" color="primary" @change="sendImage" v-model="images"
                    placeholder="Upload your documents" label="عکس‌">
                    <template v-slot:prepend>

                        <PhotoIcon style="margin-left: -20px;" class="  text-grey" />


                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary">
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>

                </v-file-input>
               
                <div class="image-preview-container">
                     
                    <div v-for="(preview, index) in imageIds" :key="index">
    
                        <v-img :src="address + '/api/product/product-image/'+preview+'/ '" class="chip-image-preview object-cover " ><v-avatar size="30" class="ma-3"
                            @click="imageIds.splice(imageIds.indexOf(preview), 1)"
                            color="red-darken-2" icon="">
                            <TrashIcon size="15" />
                        </v-avatar></v-img>
                    </div>
                </div>                      

                <v-combobox 
                    v-if="id==null"
                    rounded="lg" 
                    accept=".zip,.rar" 
                    persistent-hint 
                    variant="outlined" 
                    color="primary"
                    v-model="file_type" 
                    :disabled="id?true:false"
                    :label="id?get_file? 'فایل' : 'لیست لایسنس اکانت کد یکتا':'انتخاب نوع محصول'" 
                    :items="['لیست لایسنس اکانت کد یکتا','لایسنس اکانت کد یکتا' , 'فایل' ]">
                </v-combobox>

                <v-file-input 
                    rounded="lg" 
                    accept=".zip,.rar" persistent-hint 
                    variant="outlined" 
                    color="primary"
                    v-if="id?get_file:file_type == 'فایل'" 
                    v-model="file" placeholder="اضافه کردن فایل" 
                    :label="id?'تعویض فایل محصول':'فایل محصول'">
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="  text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary">
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>

                <a v-if="get_file" :href="get_file" class="d-flex justify-start w-100 ps-15">
                    دانلود فایل فعلی
                </a>
                <v-row class="mt-1 mb-5 rtl"  v-if="id ? get_file == null : file_type == 'لایسنس اکانت کد یکتا'">
                    <v-col cols="12" md="3">
                        <v-text-field  
                            label="عنوان" 
                            rounded="lg" 
                            persistent-hint 
                            variant="outlined" 
                            color="primary" 
                            class=""
                            v-model="header"/>
                    </v-col>
                    <v-col cols="12" md="7">
                        <v-text-field  
                            label="اطلاعات ردیف" 
                            rounded="lg" 
                            persistent-hint 
                            variant="outlined" 
                            color="primary" 
                            class=""
                            v-model="body"/>
                    </v-col>
                    <v-col cols="12" md="2" >
                        <v-btn  
                            type="submit" 
                            :disabled="body == ''" 
                            class="rounded-lg mt-2" 
                            color="primary"
                            @click="addRow()"
                            variant="flat">

                            اضافه کردن ردیف
                            
                            <template v-slot:append>
                                <CheckIcon size="17" />
                            </template>
                        </v-btn>
                    </v-col>
                </v-row>
                

                <v-file-input 
                    :key="fileInputKey"
                    rounded="lg" 
                    accept=".xlsx"
                    persistent-hint 
                    variant="outlined" 
                    color="primary"
                    v-if="id ? get_file == null : file_type == 'لیست لایسنس اکانت کد یکتا'" 
                    @change="handleCsvUpload" 
                    placeholder="اضافه لیست"
                    :label="id ? 'اضافه کردن به لیست محصول' : 'لیست محصول'">
                    <template v-slot:prepend>
                        <FileImportIcon style="margin-left: -20px;" class="text-grey" />
                    </template>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip size="small" label color="primary">
                            {{ fileName }}
                        </v-chip>
                        </template>
                    </template>
                    </v-file-input>
                    <v-alert v-if="file_type == 'لیست لایسنس اکانت کد یکتا'" class="mt-2 mb-5 rounded-lg" title="نکته"
                    text="برای ثبت لایسنس‌های خود، لطفاً فایل اکسل را با دقت تکمیل کنید و در نظر داشته باشید اولین ردیف را به عنوان تخصیص دهید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند."></v-alert>

                    <!-- Show CSV data -->
                    <div v-if="transformedData.length > 0">
                    <div class="d-flex items-center">
                        <p class="pt-5 pb-2">ردیف های اضافه شده:</p>
                        <p class="pt-5 pb-2 mx-3 text-sm-body-2 text-red cursor-pointer" @click="clearData">پاک کردن همه</p>
                    </div>
                    <div class=" d-flex justify-end w-100">
                        <v-table fixed-header class="w-100">
                            <tbody class="scrollable-tbody bg-grey-lighten-3 rounded-lg ">
                                <tr v-for="items in transformedData" :key="items" class="d-flex justify-end items-center pt-2" >
                                    <td class="table-cell  rtl" v-for="item in items">
                                        <div class=" bg-grey-lighten-5 text-grey-darken-3 rounded-xl py-2 px-6 text-center ">
                                            <span class="font-weight-bold " >{{ item.title }}:</span>
                                            {{ item.body }}
                                        </div>
                                    </td>
                                    <v-btn class="mb-2  me-2 ms-1" icon color="red" variant="tonal" size="small"
                                        @click="transformedData.splice(transformedData.indexOf(items), 1);snackbar_delete=true">
                                        <TrashIcon size="18" />
                                    </v-btn>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                </div>
                
                <div v-if="subset_product.length>0" class="" >
                    <div class="d-flex items-center ">
                        <p class="pt-5 pb-2"> ردیف های موجود از قبل:</p>
                        </div>
                    <div class=" d-flex justify-end w-100">
                        <v-table fixed-header class="w-100">
                            <tbody class="scrollable-tbody bg-grey-lighten-4 rounded-lg ">
                                <tr v-for="items in subset_product" :key="items" class="d-flex justify-end items-center pt-2" >
                                    <td class="table-cell  rtl" v-for="item in items.data">
                                        <div class=" bg-green-lighten-4 text-green-darken-4 rounded-xl py-2 px-6 text-center ">
                                            <span class="font-weight-bold" >{{ item.title }}:</span>
                                            {{ item.body }}
                                        </div>
                                    </td>
                                    <v-btn class="mb-2  me-2 ms-1" icon color="red" variant="tonal" size="small"
                                        @click="subset_product.splice(subset_product.indexOf(items), 1);snackbar_delete=true; removeSubsetProduct(items)">
                                        <TrashIcon size="18" />
                                    </v-btn>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                </div>

        


            <v-expansion-panels>
                <v-expansion-panel elevation="0">
                    <v-expansion-panel-title color="grey-lighten-4" class="mt-10">
                        <div class="d-flex w-100 justify-space-between  align-center">
                            <div>
                                کد تخفیف
                            </div>
                            <div class="font-weight-bold">
                                +
                            </div>
                        </div>
                    </v-expansion-panel-title>
                   
                    <v-expansion-panel-text class="border-b ">
                        <AddDiscountcodes :data="discount_codes" @change="(data) => { discount_codes = data }" />
                    </v-expansion-panel-text>
                    <p class="text-red text-body-1 pt-2">{{ error }}</p>
                </v-expansion-panel>
            </v-expansion-panels>

            <div class="d-flex flex-wrap mt-7 w-full lr">
                <v-checkbox v-model="discount" color="primary" label="دارای تخفیف" class="flex-grow-1"/>
                <v-checkbox v-model="pin_profile" color="primary" label="پین بودن در صفحه ی پروفایل شما" class="flex-grow-1"/>
            </div>


            </v-locale-provider>
            <v-slide-y-transition>
                <v-row v-if="discount" class="mt-1 mb-5 rtl">
                    <v-col cols="12" md="3">
                        <v-text-field label="درصد تخفیف" rounded="lg" v-model="value" :max="100" min="1" required type="number" persistent-hint
                            variant="outlined" color="primary" />
                    </v-col>
                    <v-col cols="12" md="9" hidden>
                        <v-slider label="" variant="outlined" color="primary" class="mt-3"
                            v-model="value" :min="0" :max="100" :step="1" thumb-label></v-slider>
                    </v-col>
                </v-row>
            </v-slide-y-transition>

            
            <div class="d-flex" >
                <v-btn rounded="lg" persistent-hint variant="flat" color="primary" :disabled="loadingImage"
                    class="mx-2 px-10 text-body2 font-weight-bold mb-5" type="submit">
                    ثبت
                </v-btn>
                <v-btn rounded="lg" persistent-hint variant="outline" color="primary" :disabled="loadingImage"
                    class=" px-10 text-body2  font-weight-bold mb-5" @click="$emit('cancel')">
                    برگشت
                </v-btn>
            </div>
        </form>
    </div>
</template>
<script>
import Papa from 'papaparse';
import { XIcon, PhotoIcon, VideoIcon, FileImportIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import AddCategories from '@/components/section/product/AddCategories.vue';
import AddDiscountcodes from '@/components/section/product/AddDiscountcodes.vue';
import * as XLSX from 'xlsx';

export default {
    components: { CheckIcon, XIcon, PhotoIcon, VideoIcon, FileImportIcon, TrashIcon, AddCategories, AddDiscountcodes },
    emits:["close","cancel"],
    props: ["id"],
    data: () => ({
        snackbar_delete: false,
        price: 0,
        fileInputKey: Date.now(),
        title: null,
        body: '',
        header: '',
        csvData: [],
        formattedDate:[],
        transformedData: [],
        description: null,
        images: [],
        imageIds: [],
        loadingImage: false,
        imagePreviews: [],
        categories: [],
        selectedCategories: [],
        file_type: null,
        discount_codes: [],
        subset_product : [],
        tab: null,
        discount: false,
        images: [],
        pin_profile:false,
        get_file: null,
        file: null,
        value: 0,
        body: '',
        editorOptions: {
            theme: "snow",
            rules: [
                files => !files || !files.some(file => file.size > 2_097_152) || 'Avatar size should be less than 2 MB!'
            ],
        },
    }),
    computed: {
        address(){
            return apiStore().address
        },
    },
    mounted() {
        this.id != null ? this.getData() : ''
    },
    methods: {
        clearData() {
            this.transformedData = [];
            this.fileInputKey = Date.now(); // Update the key to force re-render of the file input
        },
        addRow() {
            // Ensure this.transformedData is initialized as an array if not already
            if (!Array.isArray(this.transformedData)) {
                this.transformedData = [];
            }

            // Define the new row object
            const newRow = [{ title: this.header, body: this.body }];
            this.body = ''
            // Add the new row to transformedData
            this.transformedData.push(newRow);

            // Log the updated transformedData for verification
        },
        handleTextChange(newText) {
            this.description = newText;
        },
        handleCsvUpload(event) {
            // Ensure a file was selected
            if (!event.target.files || event.target.files.length === 0) return;

            const file = event.target.files[0]; // Get the first file
            const fileType = file.name.split('.').pop();

            if (fileType === "csv") {
                // Existing CSV handling code
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    Papa.parse(content, {
                        complete: (results) => {
                            this.csvData = results.data;
                            this.transformedData = this.transformCSVData(results.data);
                        },
                        header: true
                    });
                };
                reader.readAsText(file);
            } else if (fileType === "xlsx") {
                // XLSX file handling
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    // Assuming you want to read the first sheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    // Convert XLSX data to a similar format as CSV
                    this.csvData = json;
                    this.transformedData = this.transformXLSXData(json);
                    this.transformedData = this.transformedData.filter(row => row.length > 0);
                };
                reader.readAsArrayBuffer(file);
            }
        },
        transformXLSXData(data) {
            if (data.length === 0) return [];

            // The first row are headers
            const headers = data[0];
            
            // Transform the rest of the rows
            return data.slice(1).map(row => {
                return headers.map((header, index) => {
                    // Check if the cell is not empty
                    const cell = row[index];
                    if (cell != undefined && cell !== null  && cell != [] &&  cell !== '' && cell !== ' ') {
                        if (cell.length != 0) {
                            return { title: header, body: cell };
                        }
                    }
                    return null; // Return null for empty cells
                }).filter(cell => cell !== null); // Remove the nulls (empty cells)
            });
        },
        transformCSVData(data) {
            const transformedData = data.map(row => {
                // Map and filter out empty cells within each row
                return Object.keys(row)
                    .map(key => {
                        if (row[key] !== '' && row[key] !== null && row[key] != [] && row[key] !== undefined) {
                            return { title: key, body: row[key] };
                        }
                        return null;
                    })
                    .filter(item => item !== null);
            });
            // Filter out rows that are completely empty after the cell filtering
            return transformedData.filter(row => row.length > 0);
        },
        removeSubsetProduct(item){
            axios.delete(`${apiStore().address}/api/product/seller-panel/remove-row-subset-digital-product/${item.id}`,{
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        })
        },
        
        async sendDataFunc() {
            if (this.images && this.images.length) {
                this.images.forEach((file, index) => {
                    let imageFormData = new FormData();
                    imageFormData.append(`photo`, file);
                    try {
                        axios.post(`${apiStore().address}/api/product/seller-panel/add-image/`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Token ${useUserStore().userToken}`
                            },
                        }).then((data) => {
                            this.imageIds.push(data.data.id)
                            this.loadingImage = false;

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
            
        },
        // async sendData() {

        //     let  formDic = {}
        //     let formData = new FormData();
        //     // this.imageIds.forEach((element , index) => {
        //     //     formData.append(`image`, element);
        //     //     formDic[`image`] = element
        //     // });
        //     formDic[`image`] = this.imageIds
            
        //     // this.selectedCategories.forEach(element => {
        //     //     formData.append(`category`, element);
        //     // });
        //     formDic[`title`] =  this.title
        //     formDic[`price`] =  this.price
        //     formDic[`subsets_data`] =  this.transformedData
        //     formDic[`description`] =  this.description
        //     formDic[`discount`] =  this.value

        //     if(this.file != null)   formDic[`file`] =  this.file[0]
        //         let header = {headers: {
        //             'Content-Type': 'multipart/form-data',
        //             Authorization: `Token ${useUserStore().userToken}`
        //         },}
        //         let url = this.id != null ? `/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/` : '/api/product/seller-panel/digital-product-list-create/'
        //         if(this.id != null ){
        //         await  axios.patch(`${apiStore().address}${url}`, formDic, header).catch(error => {
        //             // handle error
        //             console.error('Error:', error);
        //         });

        //     }  else {
        //         await  axios.post(`${apiStore().address}${url}`, formDic, header).catch(error => {
        //             // handle error
        //             console.error('Error:', error);
        //         });                                                                                                                 
        //     }
        //     this.$emit('close')

        // },
        async sendData() {
            let formData = new FormData();
            let discount_codes_id = []
            // Add files to formData
            if (this.file != null) {
                formData.append('file', this.file[0]);
            }
            this.discount_codes.forEach(element => {
                discount_codes_id.push(element.id)
            });
            if (discount_codes_id.length >0){
                formData.append('discount_codes', discount_codes_id)
            }
            // Add other fields to formData
            formData.append('title', this.title);
            formData.append('price', this.price);
            formData.append('description', this.description);
            formData.append('discount', this.value);
            formData.append('pin_profile', this.pin_profile);

            // Assuming this.transformedData is an array or object
            formData.append('subsets_data', JSON.stringify(this.transformedData));

            // Assuming this.imageIds is an array
            this.imageIds.forEach((element) => {
                formData.append('image', element);
            });
             this.selectedCategories.forEach(element => {
                formData.append(`category`, element);
            });


            // Set headers for multipart/form-data
            let header = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${useUserStore().userToken}`
                },
            };

            let url = this.id != null ? `/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/` : '/api/product/seller-panel/digital-product-list-create/';
            try {
                if (this.id != null) {
                    await axios.patch(`${apiStore().address}${url}`, formData, header);
                } else {
                    await axios.post(`${apiStore().address}${url}`, formData, header).then((response)=> {
                        this.$emit('close');
                    });
                }
                this.$emit('close');
            } catch (error) {
                console.error('Error:', error);
            }
        },
        getData() {
            axios.get(`${apiStore().address}/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loadingData = false
                this.description = response.data.description
                this.title = response.data.title
                this.video = response.data.video
                this.pin_profile = response.data.pin_profile
                response.data.image.forEach(element => {

                    this.imageIds.push(element.id)
                });
                response.data.category.forEach(element => {
                    this.selectedCategories.push(element.id)
                })
           
                this.price = response.data.price
                this.value = response.data.discount
                this.get_file = response.data.file
                this.subset_product = response.data.subset_product
                this.discount_codes = response.data.discount_codes != null ? response.data.discount_codes : []
                if (response.data.discount) this.discount = true

            }
            )
        },
    },


}
</script>
<style>


.scrollable-tbody {
    display: block;
    max-height: 250px;
    overflow-x: auto; 
    overflow-y: scroll;
    direction:ltr !important    
    
}

.table-cell {
    min-width: 120px; 
    white-space: nowrap;
    overflow: visible;
    text-overflow: ellipsis;
}
.fixed-top-left {
    position: fixed;
    left: 10px; /* Adjust the right margin as necessary */
    top: 10px; /* Adjust the bottom margin as necessary */
    z-index: 1000; /* Ensures the button stays above other content */
}


</style>
