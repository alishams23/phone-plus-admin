<template>

    <v-dialog width="900" rounded="xl" v-model="dialog">
        <v-card rounded="xl" class="  pa-5  ">
            <v-card-text>
                <v-locale-provider rtl>
                    <v-list-item class="  pa-2 pe-4">
                        <template v-slot:prepend>
                            <v-avatar size="x-large" class="">
                                <UserIcon />
                            </v-avatar>
                        </template>
                        <v-list-item-title class=" font-weight-bold  text-nauto">
                            {{ data.author.full_name}}<br/>
                         {{ data.author.phone_number }}
                       
                        </v-list-item-title>
                    </v-list-item>
                    <div class=" text-body-1 font-weight-bold px-3 py-5 border-t">
                        تاریخ سفارش: {{ data.jalali_time }}
                    </div>
                    
                    <div class="d-flex flex-wrap border-t" v-if="data.subset_Digital">
                        <div v-for="(product, index) in data.subset_Digital.data"  class="text-body-1 bg-grey-lighten-4 rounded-pill px-3 mx-2 my-3 py-2">
                            <p><strong>{{ product.title }}</strong>: {{ product.body }}</p>
                        </div>
                    </div>
                    <div v-if="data.subsets_Digital">
                        <div  class="d-flex flex-wrap border-t" v-for="(subset_Digital, index) in data.subsets_Digital" >
                            <div class=" text-body-2 py-5 border-t">{{ index+1 }}:</div>
                            <div v-for="(product, index) in subset_Digital.data"  class="text-body-1 bg-grey-lighten-4 rounded-pill px-3 mx-2 my-3 py-2">
                                <p><strong>{{ product.title }}</strong>: {{ product.body }}</p>
                            </div>
                        </div>
                    </div>
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
        <p class="text-15 font-weight-medium">{{ data.tracking_code }}</p>
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
        <h6 v-bind="props" style="width: 200px !important;" class="text-body-1 text-muted">{{ data.digital_product.title }}</h6>
    </td>
    <td>
        <h6 class="text-body-1 text-muted">{{ data.used_default_payment == false ? 'بله' : 'خیر' }}</h6>
    </td>
    <td>
        <v-btn v-if="data.is_payed" :loading="data.id == loadingStatus" density="compact" :ripple="false" variant="flat"
            rounded="md" class="bg-green pa-0 ">

            <v-chip variant="text" class="text-body-2 px-3 py-1 text-white " size="x-small">

                پرداخت شده
            </v-chip>

        </v-btn>
        <v-btn v-else disabled :loading="data.id == loadingStatus" density="compact" :ripple="false" variant="flat"
            rounded="md" class="bg-grey-lighten-5 pa-0">

            <v-chip class="text-body-2 px-3 py-1  text-white " size="x-small">
                لغو شده
            </v-chip>

        </v-btn>
    </td>
    <td>
        <h6 v-if="data.price != 0" class="text-h6 text-right">{{ price(data.price) }} تومان</h6>
        <h6 v-else class="text-h6 text-right">-</h6>
    </td>
    <td>
        <v-btn @click="dialog = true" v-if="data.digital_product.type == 'license'" class=" text-right text-xs" icon=""
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
