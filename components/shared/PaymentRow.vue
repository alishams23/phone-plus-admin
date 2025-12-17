<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        وضعیت با موفقیت ویرایش شد
    </v-snackbar>
    <v-dialog  width="900" rounded="xl" v-model="dialog" persistent>
        <v-card rounded="xl" class="pa-5 payment-details-dialog-card">
            <v-btn
                icon
                variant="text"
                color="grey-darken-2"
                class="payment-details-close"
                aria-label="بستن"
                @click="dialog = false"
            >
                <XIcon size="20" />
            </v-btn>
            <v-card-text>
                <v-locale-provider rtl>
                    <v-list-item class="pa-2 pe-4 payment-details-header">
                        <template v-slot:prepend>
                            <v-avatar size="x-large" class="">
                                <UserIcon />
                            </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-bold text-nauto payment-details-author-name">
                            {{ data.author.full_name }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                            v-if="data.author?.phone_number"
                            class="payment-details-author-phone"
                        >
                            {{ data.author.phone_number }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                            <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">
                                محصول فیزیکی
                            </v-chip>
                        </template>
                    </v-list-item>

                    <v-row class="pt-4" dense>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 bg-grey-lighten-4 rounded-lg h-100">
                                <div class="d-flex align-center justify-space-between pb-3">
                                    <div class="text-body-1 font-weight-bold">اطلاعات سفارش</div>
                                    <v-chip label color="primary" variant="tonal" size="small" class="font-weight-bold">
                                        {{ data.order_id }}
                                    </v-chip>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">تاریخ پرداخت</span>
                                    <span class="font-weight-bold text-body-1">{{ data.jalali_time }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">کد پیگیری خرید</span>
                                    <span class="font-weight-bold text-body-1">{{ data.tracking_code || '-' }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">تعداد</span>
                                    <span class="font-weight-bold text-body-1">{{ data.count }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center pt-2" v-if="data.author?.phone_number">
                                    <span class="text-body-2 text-muted">شماره تماس</span>
                                    <span class="font-weight-bold text-body-1">{{ data.author.phone_number }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center pt-3">
                                    <span class="text-body-2 text-muted">وضعیت پرداخت</span>
                                    <v-chip v-if="data.is_payed" color="green" class="text-" label size="small">
                                        پرداخت شده
                                    </v-chip>
                                    <v-chip v-else color="grey-lighten-2" label size="small">
                                        لغو شده
                                    </v-chip>
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-sheet class="pa-4 rounded-lg h-100" color="grey-lighten-5">
                                <div class="text-body-1 font-weight-bold pb-3">جزئیات پرداخت</div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">پرداخت پیش‌فرض</span>
                                    <span class="font-weight-bold text-body-1">{{ data.used_default_payment === false ? 'بله' : 'خیر'}}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">درگاه پرداخت</span>
                                    <span class="font-weight-bold text-body-1">{{ data.gateway ? gateway[data.gateway]: '-' }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">کارمزد</span>
                                    <span class="font-weight-bold text-body-1">{{ price(data.payment_fee) }} تومان</span>
                                </div>
                                <div class="d-flex justify-space-between align-center pt-2">
                                    <span class="text-body-2 text-muted">مبلغ کل</span>
                                    <span class="font-weight-bold text-body-1">{{ data.price ? price(data.price) : '-' }} تومان</span>
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>

                    <v-sheet class="mt-4 pa-4 rounded-lg" color="grey-lighten-4">
                        <div class="d-flex align-center justify-space-between">
                            <div class="text-body-1 font-weight-bold">وضعیت ارسال</div>
                            <v-menu>
                                <template v-slot:activator="{ props }">
                                    
                                    <v-btn 
                                        v-if="data.is_payed" 
                                        :loading="data.id == loadingStatus" 
                                        density="compact" 
                                        :ripple="false" 
                                        v-bind="props"
                                        variant="flat" 
                                        rounded="md"
                                        :class="data.status == 'received' ? 'bg-green' : data.status == 'sended' ? 'bg-primary' : 'bg-red'"
                                        class="pa-0">
                                    
                                        <v-chip 
                                            class="text-body-2 px-3 py-1  text-white " 
                                            size="x-small">
                                           
                                            {{ data.status == 'received' ? ' تحویل داده شده' : data.status == 'sended' ? ' ارسال شده ' : ' در حال آماده سازی محصول' }}
                                            <ChevronDownIcon size="15" class="ms-2" />
                                        </v-chip>
                                    
                                    </v-btn>
                                    <v-btn
                                        disabled
                                        v-else
                                        :loading="data.id == loadingStatus" 
                                        density="compact" 
                                        :ripple="false" 
                                        variant="flat" 
                                        rounded="md"
                                        class="bg-grey-lighten-5 pa-0">
                                    
                                        <v-chip 
                                            class="text-body-2 px-3 py-1  text-white " 
                                            size="x-small">
                                           
                                            لغو شده
                                        </v-chip>
                                    
                                    </v-btn>
                                    
                                        
                                </template>
                                <v-list 
                                rounded="lg"
                                elevation="10">
                                    <v-list-item v-for="(itemStatus, index) in items" :key="index" :value="itemStatus.value"
                                        :class="data.status == itemStatus.value ? 'bg-grey-lighten-3 text-black text-weight-bold ' : ''"
                                        @click="data.status = itemStatus.value; changeStatus(data.id, data.status)">
                                        <v-list-item-title class="text-body-1 rtl"
                                            :class="data.status == itemStatus.value ? 'font-weight-bold ' : ''">{{
                                                itemStatus.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-sheet>

                    <v-sheet class="mt-4 pa-4 rounded-lg" color="grey-lighten-5">
                        <div class="text-body-1 font-weight-bold pb-3">آدرس ارسال</div>
                        <v-row>
                            <v-col cols="6" md="6">
                                <div class="text-body-2 text-muted">استان</div>
                                <div class="font-weight-bold text-body-1 pt-1">{{ data.state }}</div>
                            </v-col>
                            <v-col cols="6" md="6">
                                <div class="text-body-2 text-muted">شهر</div>
                                <div class="font-weight-bold text-body-1 pt-1">{{ data.city }}</div>
                            </v-col>
                            <v-col cols="12" md="8">
                                <div class="text-body-2 text-muted">محل سکونت</div>
                                <div class="font-weight-bold text-body-1 pt-1">{{ data.street }}</div>
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="text-body-2 text-muted">کدپستی</div>
                                <div class="font-weight-bold text-body-1 pt-1">{{ data.zipCode }}</div>
                            </v-col>
                        </v-row>
                    </v-sheet>

                    <v-sheet class="mt-4 pa-4 rounded-lg" color="grey-lighten-4">
                        <div class="text-body-1 font-weight-bold pb-3">محصول</div>
                        <v-card elevation="0"  class="rtl">
                            <v-row class="d-flex flex-no-wrap justify-space-between">
                                <v-col cols="12" md="4">
                                    <v-avatar size="230" rounded="xl">
                                    <v-img :src="data.product.image[0].photo" cover></v-img>
                                    </v-avatar>
                                </v-col >
                                

                                <v-col cols="12" md="8">
                                    
                                <v-card-title class="text-h5 font-weight-bold">
                                    {{ data.product.title }}
                                </v-card-title>
                                <v-card-text class="text-line-1">
                                    <div v-html=" data.product.description">
                                    </div>
                                </v-card-text>
                                
                                </v-col>
                                
                            </v-row>
                        </v-card>
                    </v-sheet>
                </v-locale-provider>
            </v-card-text>
        </v-card>
    </v-dialog>
    <td>
        <p class="text-15 font-body-1">{{data.jalali_time}}</p>
    </td>
    <td>
        <p class="text-15 font-weight-medium">{{ data.order_id }}</p>
    </td>
    <td>
        <div class="">
            <v-sheet v-bind="props" v-if="data.author">
                
                <h6 class=" text-body-1 font-weight-bold text-muted">{{ data.author.full_name }}
                </h6>

            </v-sheet>
           
        </div>
    </td>
    <td>
        <h6 v-bind="props" style="width: 100px !important;" class="text-body-1 text-muted">{{ data.product.title }}</h6>
    </td>
    <td>
        <h6 class="text-body-1 text-muted">{{ data.count }}</h6>
    </td>
    <td>
        <v-menu>
            <template v-slot:activator="{ props }">

                <v-btn 
                    v-if="data.is_payed" 
                    :loading="data.id == loadingStatus" 
                    density="compact" 
                    :ripple="false" 
                    v-bind="props"
                    variant="flat" 
                    rounded="md"
                    :class="data.status == 'received' ? 'bg-green' : data.status == 'sended' ? 'bg-primary' : 'bg-red'"
                    class="pa-0">
                
                    <v-chip 
                
                    variant="text"
                        class="text-body-2 px-3 py-1 ma-0  text-white " 
                        size="x-small">
                       
                        {{ data.status == 'received' ? ' تحویل داده شده' : data.status == 'sended' ? ' ارسال شده ' : ' در حال آماده سازی محصول' }}
                        <ChevronDownIcon size="15" class="ms-2" />
                    </v-chip>
                
                </v-btn>
                <v-btn 
                    v-else
                    disabled
                    :loading="data.id == loadingStatus" 
                    density="compact" 
                    :ripple="false" 
                    variant="flat" 
                    rounded="md"
                    class="bg-grey-lighten-5 pa-0">
                
                    <v-chip 
                    variant="text" 

                        class="text-body-2 px-3 py-1  text-white " 
                        size="x-small">
                       
                        لغو شده
                    </v-chip>
                
                </v-btn>

            </template>
            <v-list 
            rounded="lg"
            elevation="10">
                <v-list-item v-for="(itemStatus, index) in items" :key="index" :value="itemStatus.value"
                    :class="data.status == itemStatus.value ? 'bg-grey-lighten-3 text-black text-weight-bold ' : ''"
                    @click="data.status = itemStatus.value; changeStatus(data.id, data.status)">
                    <v-list-item-title class="text-body-1 rtl"
                        :class="data.status == itemStatus.value ? 'font-weight-bold ' : ''">{{
                            itemStatus.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </td>
    <td class="text-right">
        <h6 v-if="data.price!=0" class="text-h6 text-right">{{ price(data.price) }} <span class="text-body-2 text-xs" >تومان</span></h6>
        <h6 v-else class="text-h6 text-right">-</h6>
    </td>
    <td>
        <v-btn 
            @click="dialog=true" 
            v-if="data" 
            class=" text-right text-xs" 
            icon="" 
            color="primary" 
            size="x-small"  
            variant="tonal">

            <EyeIcon size="15"/>
        </v-btn>
    </td>
    

 
</template>
<script>
  
import { UserIcon, XIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";
import { parseISO, format } from 'date-fns';
import { EyeIcon, ChevronDownIcon } from 'vue-tabler-icons';

export default {
  
    components: {
        UserIcon,
        XIcon,
        EyeIcon,
        ChevronDownIcon
    },
    props:["data"],
    data() {
        return {
            snackbar: false,
            loading: true,
            loadingStatus: 0,
            dialog:false,
            gateway:{
                'sep':'سامان کیش (سپ)',
                'sadad': 'سداد',
                'zarinpal' : 'زرین پال'
            },
            items: [
                { title: 'تحویل داده شده', value: 'received' },
                { title: 'ارسال شده ', value: 'sended' },
                { title: 'در حال آماده سازی محصول', value: 'none' },
            ],
        }
    },
    methods: {
        price(value){
            let text
            let chars = Array.from(`${value/10}`)
            for (let index = 1; index <= chars.length; index++) {
                
                if(index % 3==0){
                    if (chars.length != index) {
                    chars[chars.length-index] = `,${chars[chars.length-index]}`;
                        
                    }
                }

            }
            return chars.join("");;
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
    }
}
</script>

<style scoped>
.payment-details-dialog-card {
  position: relative;
}

.payment-details-close {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
}

:deep(.payment-details-header .v-list-item__content) {
  min-width: 0;
}

.payment-details-author-name,
.payment-details-author-phone {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 600px) {
  :deep(.payment-details-header .v-list-item__append) {
    align-self: flex-start;
  }
}
</style>
