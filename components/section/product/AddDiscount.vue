<template>
    <v-locale-provider rtl>
    <v-checkbox @click="discount == false ? value = 0 : ''" v-model="discount" color="primary"
    label="دارای تخفیف">
</v-checkbox>
</v-locale-provider>
<v-slide-y-transition>
    <v-row v-if="discount" class="mt-1 mb-5 rtl">
        <v-col cols="12" md="3">
            <v-text-field label="درصد تخفیف" rounded="lg" :max="100" min="1" v-model="valueData" required type="number" persistent-hint
                variant="outlined" color="primary" />
        </v-col>
        <v-col cols="12" md="9" hidden>
            <v-slider label="" variant="outlined" color="primary" class="mt-3"
                v-model="valueData" :min="0" :max="100" :step="1" thumb-label></v-slider>
        </v-col>
    </v-row>
</v-slide-y-transition>

</template>
<script>
import { PlusIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    emits: ["change"],

    props: ["value",],
    components: {
        PlusIcon, TrashIcon,
        CheckIcon
    },
    data() {
        return {
            discount: false,
            valueData:0
        }
    },
    methods: {
        async createColor() {
            this.loadingColor = true
            axios.post(`${apiStore().address}/api/product/seller-panel/product-color-list-create/`,
                {
                    title: this.title_color,
                    price: this.price_color,
                    count: this.count_color,
                    hexcolor: this.hexcolor,
                }, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.loadingColor = false
                    this.data.push({
                        title: this.title_color,
                        price: this.price_color,
                        hexcolor: this.hexcolor,
                        count: this.count_color,
                        id: response.data.id
                    })
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
    },
    mounted() {
        this.valueData = this.value
    },
    watch: {
        valueData: {
            handler: function (val, oldVal) {
                this.$emit("change", val)
            },

        },

    },
}
</script>