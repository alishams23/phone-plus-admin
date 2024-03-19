<template>
    <form @submit.prevent="createColor" class="pb-4">
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field required label="نام رنگ" rounded="lg" v-model="title_color" variant="outlined"
                    color="primary" class="mt-10" />
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
                <v-text-field required type="number" min="0" label="قیمت کالا با این رنگ(تومان)" rounded="lg"
                    v-model="price_color" variant="outlined" color="primary" class="mt-10" />

            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
                <v-text-field required type="number" min="1" label=" تعداد موجودی این رنگ" rounded="lg"
                    v-model="count_color" variant="outlined" color="primary" class="mt-10" />

            </v-col>
            <v-col cols="12" class="d-flex align-end justify-space-between">

                <v-color-picker elevation="10" class="rounded-xl" required v-model="hexcolor" mode="hex">
                </v-color-picker>
                <v-btn type="submit" :disabled="hexcolor?false:true"  :loading="loadingSpecification" class="mt-4 px-10 rounded-lg mx-3" color="primary"
                    variant="flat">
                    ثبت رنگ
                    <template v-slot:append>
                        <CheckIcon size="17" />
                    </template>
                </v-btn>
            </v-col>
        </v-row>

    </form>
    <v-row v-for="item in data" class="bg-grey-lighten-5 mb-2 mt-4 rounded-xl" align="center">
        <v-col>رنگ : {{ item.title }}</v-col>
        <v-col>قیمت : {{ item.price }}</v-col>
        <v-col>کد : {{ item.hexcolor }}</v-col>
        <v-col class="d-flex justify-space-between align-center">
            <div>
                تعداد : {{ item.count }}
            </div>
            <v-btn @click="data.splice(data.indexOf(item), 1)" icon="" variant="tonal" class="mx-3" elevation="0"
                color="red" size="small">
                <TrashIcon size="17" />
            </v-btn>
        </v-col>


    </v-row>

</template>
<script>
import { PlusIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    emits: ["change"],
    props: ["data",],
    components: {
        PlusIcon, TrashIcon,
        CheckIcon
    },
    data() {
        return {
            loadingColor: false,
            title_color: null,
            price_color: null,
            count_color: null,
            hexcolor: null,
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

    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.$emit("change", val)
            },

        },

    },
}
</script>