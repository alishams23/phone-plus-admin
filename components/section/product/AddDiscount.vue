<template>
    <v-locale-provider rtl>
    <v-checkbox @click="discount == false ? value = 0 : ''" v-model="discount" color="primary"
    label="دارای تخفیف">
</v-checkbox>
</v-locale-provider>
<v-slide-y-transition>
    <v-slider v-if="discount" label="درصد تخفیف" variant="outlined" color="primary" class="mt-5" v-model="valueData"
        :min="0" :max="100" :step="1" thumb-label></v-slider>
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
            axios.post(`${apiStore().address}/api/product/admin/product-color-list-create/`,
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