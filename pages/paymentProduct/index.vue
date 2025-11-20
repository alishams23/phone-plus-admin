
<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        وضعیت با موفقیت ویرایش شد
    </v-snackbar>
    <v-card flat>
        <v-container>
    <v-row class="rtl">
        <v-col cols="12" md="7" class="rtl d-flex align-center mt-md-6">
        <v-avatar color="primary" rounded="lg" size="50">
            <CoinsIcon />
        </v-avatar>
        <div class="px-5 font-weight-bold text-h4">پرداخت‌ها</div>
        </v-col>
    
    </v-row>
    <v-tabs  color="primary" v-model="model" class="border-b mt-5" align-tabs="end" >
        <v-tab class="px-md-15 rounded-t-lg"  color="primary" :text="'محصولات دیجیتال'" :value="0"></v-tab>
        <v-tab class="px-md-15 rounded-t-lg"  color="primary" :text="'محصولات فیزیکی'" :value="1"></v-tab>
    </v-tabs>
</v-container>



        <v-window :touch="false" v-model="model">
            <v-window-item  :value="0">
                <v-card>
                    <v-card-text>
                        <div>
                            <v-container class="pt-0 mt-0">
                                <v-row align="center" class="rtl ">
                                    <v-col cols="12" md="6" class="rtl d-flex align-center">
                                        
                                    </v-col>
                                    <v-col cols="12" md="6" >
                                       <v-row>
                                        <v-col cols="12" md="6" class="py-0" >
                                            <v-locale-provider rtl>
                                            <v-text-field v-model="search_text" @update:model-value="searchDataDigitalProduct" label="جستجو" rounded="lg"
                                                persistent-hint variant="outlined" color="primary" dense class=" text-body-2">
                                                <template v-slot:prepend-inner>
                                                    <SearchIcon color="gray" />
                                                </template>
                                       
                                            </v-text-field>
                                        </v-locale-provider>
                                        </v-col>
                                        <v-col cols="12" md="6" class="py-0" >
                                            <v-btn @click="order_digital = !order_digital; searchDataDigitalProduct()" variant="tonal" color="primary" rounded="lg"
                                                        size="50">
                                                        <SortDescending2Icon v-if="order_digital" />
                                                        <SortAscending2Icon v-if="!order_digital" />
                                                    </v-btn>
                                                    <v-btn @click="is_payed_digital == ''? is_payed_digital = true : is_payed_digital = ''; searchDataDigitalProduct()"
                                                        :variant="is_payed_digital == true ? 'tonal' : 'outlined'" color="primary" height="50px"
                                                        class="ms-3 " rounded="lg">
                                                        <div class="d-flex justify-center " v-if="is_payed_digital == ''">
                                                            <CheckIcon class="me-3" />
                                                            <div>
                                                                لغو شده‌ها
                                                            </div>
                                                        </div>
                                                        <span v-else>لغو شده‌ها</span>
                                                    </v-btn>
                                        </v-col>
                                       </v-row>
                                      
                                    </v-col>
                                    
                                </v-row>
                                <v-alert v-if="data_digital_product.length == 0 && loading_digital == false" color="primary" icon="fa fa-info" variant="tonal"
                                    border="start" class="rtl border-opacity-100 my-10">
                                    <div class="text-sm  irsa">
                                        پرداختی وجود ندارد
                                    </div>
                                </v-alert>
                            </v-container>
                            <div class="d-flex justify-center">
                                <v-progress-circular v-if="loading_digital" bg-color="transparent" :size="55" class="ma-10" :width="5" color="primary"
                                    indeterminate>
                                </v-progress-circular>
                            </div>
                            <v-container v-if="loading_digital == false">
                                <v-card v-if="data_digital_product.length != 0" elevation="0" class="">
                                    <v-card-item class="pa-0 ">
                                        <v-card-title class="text-h5 rtl pt-sm-1 pb-3 font-weight-black"> تمامی فروش‌ها </v-card-title>
                                        <v-table class="month-table rtl">
                                            <thead>
                                                <tr>
                                                    <th class="text-subtitle-1 font-weight-bold">تاریخ پرداخت</th>
                                                    <th class="text-subtitle-1 font-weight-bold">کد سفارش</th>
                                                    <th class="text-subtitle-1 font-weight-bold">مشتری</th>
                                                    <th class="text-subtitle-1 font-weight-bold">محصول دیجیتال</th>
                                                    <th class="text-subtitle-1 font-weight-bold">وضعیت پرداخت</th>
                                                    <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                                                    <th class="text-subtitle-1 font-weight-bold text-right">جزئیات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="item in data_digital_product" :key="item.name" class="month-item ">
                                                <PaymentRowDigitalProduct :data="item" />
                                            </tr>
                                        </tbody>
                                        </v-table>
                                    </v-card-item>
                                </v-card>
                            </v-container>
                        </div>
                    </v-card-text>
                    <div class="text-center mt-16 mb-10" v-if="loading_digital == false && !(page_digital_product == 1 && next_digital_product == null)">
                        <v-btn
                            variant="flat" 
                            rounded="lg" 
                            color="primary"
                            class="mx-1"
                            @click="page_digital_product = page_digital_product -1 ; searchDataDigitalProduct()"
                            :disabled="page_digital_product < 2" 
                            >
                            صفحه قبل
                        </v-btn>
                        <v-btn
                        variant="flat" 
                            rounded="lg" 
                            class="mx-1"
                            :disabled="next_digital_product == null"
    
                            color="primary"
                        @click="page_digital_product = page_digital_product +1 ; searchDataDigitalProduct()" 
                        >
                            صفحه بعد
                        </v-btn>
                    </div>
                </v-card>
            </v-window-item>
            <v-window-item :value="1">
                <v-card>
                    <v-card-text>
                        <div>
                            <v-container class="pt-0 mt-0">
                                <v-row align="center" class="rtl">
                                    <v-col cols="12" md="4" class="rtl  d-flex align-center">
                                       
                                    </v-col>
                                    <v-col cols="12" md="8"  >
                                        
                                          <v-row >
                                            <v-col cols="12" md="6" class="py-0">
                                                <v-locale-provider rtl>
                                            <v-text-field v-model="search_text" @update:model-value="searchDataProduct" label="جستجو" rounded="lg"
                                                persistent-hint variant="outlined" color="primary" dense class=" text-body-2 ">
                                                <template v-slot:prepend-inner>
                            
                                                    <SearchIcon color="gray" />
                                                </template>
                                              
                                            </v-text-field>
                                        </v-locale-provider>
                                           </v-col>
                                            <v-col cols="12" md="6" class="py-0">
                                                <v-btn @click="order = !order; searchDataProduct()" variant="tonal" color="primary" rounded="lg"
                                                        size="50">
                                                        <SortDescending2Icon v-if="order" />
                                                        <SortAscending2Icon v-if="!order" />
                                                    </v-btn>
                                                    <v-btn @click="handleUnsent"
                                                        :variant="statusCheck == '' ? 'tonal' : 'outlined'" color="primary" height="50px"
                                                        class="ms-3 " rounded="lg">
                                                        <div class="d-flex justify-center " v-if="statusCheck == 'none'">
                                                            <CheckIcon class="me-3" />
                                                            <div>
                                                                ارسال نشده‌ها
                                                            </div>
                                                        </div>
                                                        <span v-else>ارسال نشده‌ها</span>
                                                    </v-btn>
                                                    <v-btn @click="is_payed == ''? is_payed = true : is_payed = ''; searchDataProduct()"
                                                        :variant="is_payed == true ? 'tonal' : 'outlined'" color="primary" height="50px"
                                                        class="ms-3 " rounded="lg">
                                                        <div class="d-flex justify-center " v-if="is_payed == ''">
                                                            <CheckIcon class="me-3" />
                                                            <div>
                                                                لغو شده‌ها
                                                            </div>
                                                        </div>
                                                        <span v-else>لغو شده‌ها</span>
                                                    </v-btn>
                                            </v-col>
                                           
                                          </v-row>
                                      
                            
                                    </v-col>
                                
                                </v-row>
                                <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
                                    border="start" class="rtl border-opacity-100 my-10">
                                    <div class="text-sm  irsa">
                                        پرداختی وجود ندارد
                                    </div>
                                </v-alert>
                            </v-container>
                            <div class="d-flex justify-center">
                                <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="5" color="primary"
                                    indeterminate>
                                </v-progress-circular>
                            </div>
                            <v-container v-if="loading == false">
                                <v-card v-if="data.length != 0" elevation="0" class="">
                                    <v-card-item class="pa-0 ">
                                        <v-card-title class="text-h5 rtl pt-sm-1 pb-3 font-weight-black"> تمامی فروش‌ها </v-card-title>
                                        <v-table class="month-table rtl">
                                            <thead>
                                                <tr>
                                                    <th class="text-subtitle-1 font-weight-bold">تاریخ پرداخت</th>
                                                    <th class="text-subtitle-1 font-weight-bold">کد سفارش</th>
                                                    <th class="text-subtitle-1 font-weight-bold">مشتری</th>
                                                    <th class="text-subtitle-1 font-weight-bold">محصول</th>
                                                    <th class="text-subtitle-1 font-weight-bold">تعداد</th>
                                                    <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                                                    <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                                                    <th class="text-subtitle-1 font-weight-bold text-right">جزئیات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="item in data" :key="item.name" class="month-item ">
                                                <PaymentRow :data="item" />
                                            </tr>
                                        </tbody>
                                        </v-table>
                                    </v-card-item>
                                </v-card>
                            </v-container>
                        </div>
                    </v-card-text>
                    <div class="text-center mt-16 mb-10" v-if="loading == false && !(page == 1 && next == null)">
                        <v-btn
                            variant="flat" 
                            rounded="lg" 
                            color="primary"
                            class="mx-1"
                            @click="page = page -1 ; searchDataProduct()"
                            :disabled="page < 2" 
                            >
                            صفحه قبل
                        </v-btn>
                        <v-btn
                        variant="flat" 
                            rounded="lg" 
                            class="mx-1"
                            :disabled="next == null"
    
                            color="primary"
                        @click="page = page +1 ; searchDataProduct()" 
                        >
                            صفحه بعد
                        </v-btn>
                        
                    </div>
                </v-card>
            </v-window-item>
        </v-window>
    </v-card>
    
</template>


<script>
import  PaymentRow  from '@/components/shared/PaymentRow.vue';
import { CoinsIcon, SearchIcon, SortDescending2Icon, SortAscending2Icon, CheckIcon, PencilIcon,UserIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";
import  PaymentRowDigitalProduct  from '@/components/shared/PaymentRowDigitalProduct.vue';

export default {
    components: {
        PaymentRow,
        PaymentRowDigitalProduct,
        SortDescending2Icon,
        SortAscending2Icon,
        CoinsIcon,
        SearchIcon,
        CheckIcon,
        PencilIcon,
        UserIcon,
    },
    data() {
        return {
            model:0,
            data_digital_product: [],
            data: [],
            snackbar: false,
            loading: true,
            loading_digital: true,
            search_text: '',
            order_digital: true,
            order: true,
            loadingStatus: 0,
            is_payed:true,
            is_payed_digital:true,
            items: [
                { title: 'تحویل داده شده', value: 'received' },
                { title: 'ارسال شده ', value: 'sended' },
                { title: 'ارسال نشده', value: 'none' },

            ],
            statusCheck: '',
            page:1,
            next:null,
            page_digital_product:1,
            next_digital_product:null,
        }
    },
    methods: {
        handleUnsent(){
            if (this.statusCheck == ''){
                this.statusCheck = 'none'
            }else{
                this.statusCheck = ''
            }
            this.searchDataProduct()
        },
        changeStatus(id, status) {
            this.loadingStatus = id
            axios.put(`${apiStore().address}/api/order/seller-panel/order-update-status/${id}/`, { status: status }, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.snackbar = true
                this.loadingStatus = 0
            })

            

        },
        searchDataProduct() {
            this.loading = true

            axios.get(`${apiStore().address}/api/order/seller-panel/order-list-search/?page=${this.page}&search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}&status=${this.statusCheck}&is_payed=${this.is_payed}`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading = false
                this.data = response.data.results
                this.next = response.data.next
            })
        },
        searchDataDigitalProduct() {
            this.loading_digital = true

            axios.get(`${apiStore().address}/api/order/seller-panel/order-digital-product-list-search/?page=${this.page_digital_product}&search=${this.search_text}&ordering=${this.order_digital == false ? 'id' : '-id'}&is_payed=${this.is_payed_digital}`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading_digital = false
                this.data_digital_product = response.data.results
                this.next_digital_product = response.data.next
            })
        }, 
    },
    async mounted() {
        this.searchDataProduct()
        this.searchDataDigitalProduct()
    }
}
</script>
