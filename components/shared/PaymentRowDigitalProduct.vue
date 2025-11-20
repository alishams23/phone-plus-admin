<template>

    <v-dialog width="900" rounded="xl" v-model="dialog">
        <v-card rounded="xl" class="  pa-5  ">
            <v-card-text>
                <v-locale-provider rtl>
                    <v-list-item class="pa-2 pe-4">
                        <template v-slot:prepend>
                            <v-avatar size="x-large" class="">
                                <UserIcon />
                            </v-avatar>
                        </template>
                        <v-list-item-title class=" font-weight-bold  text-nauto">
                            {{ data.author.full_name}}<br/>
                         {{ data.author.phone_number }}
                       
                        </v-list-item-title>
                        <template v-slot:append>
                            <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">
                                محصول دیجیتال
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
                                <div class="d-flex justify-space-between align-center pt-2">
                                    <span class="text-body-2 text-muted">وضعیت پرداخت</span>
                                    <v-chip v-if="data.is_payed" color="green" class="" label size="small">
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
                                    <span class="font-weight-bold text-body-1">{{ data.used_default_payment == false ? 'بله' : 'خیر' }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">درگاه پرداخت</span>
                                    <span class="font-weight-bold text-body-1">{{ data.gateway ? gateway[data.gateway]: '-' }}</span>
                                </div>
                                <div class="d-flex justify-space-between align-center py-2 border-b">
                                    <span class="text-body-2 text-muted">کارمزد</span>
                                    <span class="font-weight-bold text-body-1">{{ price(data.payment_fee ) }} تومان</span>
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
                            <div class="text-body-1 font-weight-bold">جزئیات محصول دیجیتال</div>
                            <v-chip color="primary" variant="outlined" size="small" class="font-weight-bold">
                                {{ data.digital_product.title }}
                            </v-chip>
                        </div>
                        <div class="d-flex flex-wrap pt-4" v-if="data.subset_Digital">
                            <div v-for="(product, index) in data.subset_Digital.data"  class="text-body-1 bg-grey-lighten-5 rounded-pill px-3 mx-2 my-2 py-2">
                                <p class="ma-0"><strong>{{ product.title }}</strong>: {{ product.body }}</p>
                            </div>
                        </div>
                        <div v-if="data.subsets_Digital">
                            <div  class="d-flex flex-wrap pt-3" v-for="(subset_Digital, index) in data.subsets_Digital" >
                                <div class=" text-body-2 py-3">{{ index+1 }}:</div>
                                <div v-for="(product, index) in subset_Digital.data"  class="text-body-1 bg-grey-lighten-5 rounded-pill px-3 mx-2 my-2 py-2">
                                    <p class="ma-0"><strong>{{ product.title }}</strong>: {{ product.body }}</p>
                                </div>
                            </div>
                        </div>
                    </v-sheet>
                </v-locale-provider>
            </v-card-text>
        </v-card>
    </v-dialog>

    <td>
        <p class="text-15 font-body-1">{{ data.jalali_time }}</p>
    </td>
    <td>
        <p class="text-15 font-weight-medium">{{ data.order_id }}</p>
    </td>
    <td>
        <div class="">
            <v-sheet v-bind="props" v-if="data.author!=null" >
                <h6 class=" text-body-1 font-weight-bold text-muted">{{ data.author.full_name }}
                </h6>
            </v-sheet>

        </div>
    </td>
    <td >
        <h6 v-bind="props" style="width: 100px !important;" class="text-body-1 text-muted">{{ data.digital_product.title }}</h6>
    </td>
    <td>
        <v-btn v-if="data.is_payed" :loading="data.id == loadingStatus" density="compact" :ripple="false" variant="flat"
            rounded="md" class="bg-green pa-0 ">

            <v-chip variant="text" class="text-body-2 px-3 py-1  " size="x-small">

                پرداخت شده
            </v-chip>

        </v-btn>
        <v-btn v-else disabled :loading="data.id == loadingStatus" density="compact" :ripple="false" variant="flat"
            rounded="md" class="bg-grey-lighten-5 pa-0">

            <v-chip class="text-body-2 px-3 py-1   " size="x-small">
                لغو شده
            </v-chip>

        </v-btn>
    </td>
    <td class="text-right">
        <h6 v-if="data.price != 0" class="text-h6 text-right">{{ price(data.price) }} تومان</h6>
        <h6 v-else class="text-h6 text-right">-</h6>
    </td>
    <td>
        <v-btn @click="dialog = true" v-if="data" class=" text-right text-xs" icon=""
            color="primary" size="x-small" variant="tonal">

            <EyeIcon size="15" />
        </v-btn>
    </td>



</template>
<script>

import { EyeIcon, UserIcon } from 'vue-tabler-icons';
import { PencilIcon } from 'vue-tabler-icons';
import { parseISO, format } from 'date-fns';

export default {

    components: {
        EyeIcon,
        UserIcon,
        PencilIcon
    },
    props: ["data"],
    data() {
        return {
            loading: true,
            dialog:false,
            loadingStatus: 0,
            gateway:{
                'sep':'سامان کیش (سپ)',
                'sadad': 'سداد',
                'zarinpal' : 'زرین پال'
            },
            
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
    }

}
</script>
