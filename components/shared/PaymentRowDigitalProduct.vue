<template>

    <td>
        <p class="text-15 font-weight-medium">{{ data.order_id }}</p>
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
        <h6 class="text-h6 text-right">{{ data.price }} تومان</h6>
    </td>



</template>
<script>

import { UserIcon } from 'vue-tabler-icons';
import { PencilIcon } from 'vue-tabler-icons';

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
    methods: {
    }
}
</script>