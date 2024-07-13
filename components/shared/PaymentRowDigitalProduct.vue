<template>

    <td>
        <p class="text-15 font-body-1">{{data.jalali_time}}</p>
    </td>
    <td>
        <p class="text-15 font-weight-medium">{{ data.order_id }}</p>
    </td>
    <td>
        <p class="text-15 font-weight-medium">{{ data.tracking_code }}</p>
    </td>
    <td>
        <div class="">
            <v-sheet v-bind="props">
                <!-- <h6 class=" text-body-1 font-weight-bold text-muted">{{ data.author.full_name }}
                </h6> -->
            </v-sheet>

        </div>
    </td>
    <td>
        <h6 v-bind="props" class="text-body-1 text-muted">{{ data.digital_product.title }}</h6>
    </td>
    <td>
        <v-btn 
            v-if="data.is_payed"
            
            :loading="data.id == loadingStatus" 
            density="compact" 
            :ripple="false" 
            variant="flat" 
            rounded="md"
            class="bg-green pa-0 ">
        
            <v-chip 
                class="text-body-2 px-3 py-1 text-white " 
                size="x-small">
                
                پرداخت شده
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
                class="text-body-2 px-3 py-1  text-white " 
                size="x-small">
                لغو شده
            </v-chip>
        
        </v-btn>
    </td>
    <td>
        <h6 v-if="data.price!=0" class="text-h6 text-right">{{ data.price }} تومان</h6>
        <h6 v-else class="text-h6 text-right">-</h6>
    </td>



</template>
<script>

import { UserIcon } from 'vue-tabler-icons';
import { PencilIcon } from 'vue-tabler-icons';
import { parseISO, format } from 'date-fns';

export default {

    components: {
        UserIcon,
        PencilIcon
    },
    props: ["data"],
    data() {
        return {
            loading: true,
            loadingStatus: 0,
        }
    },

}
</script>