<template>
    <form @submit.prevent="createDiscountCode" class="pb-4">
        <v-row class="d-flex items-center">
            <v-col cols="12" md="2">
                <v-text-field required label="تعداد" type="number" min="1" rounded="lg" v-model="discountMaxUsage" variant="outlined"
                    color="primary" class="mt-2 mt-lg-10" />
            </v-col>
            <v-col cols="12" md="3" class="d-flex align-center justify-center">
                <v-select :items="discountTypes" label="نوع تخفیف" v-model="discountType" required rounded="lg"
                    variant="outlined" color="primary" class="mt-2 mt-lg-10"></v-select>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
                <v-text-field :label="discountLabel" required :type="'number'" :min="discountType == 'درصدی' ? '1' : '1000'"
                    :max="discountType == 'درصدی' ? '100' : ''"
                    rounded="lg" v-model="discountAmount" variant="outlined" color="primary" class="mt-2 mt-lg-10" />
            </v-col>
            <v-col cols="12" md="3" class="d-flex align-center justify-center items-center ">
                <v-btn type="submit" :disabled="!formIsValid" class="rounded-lg mt-4" color="primary"
                    variant="flat">
                    ثبت کد تخفیف
                    <template v-slot:append>
                        <CheckIcon size="17" />
                    </template>
                </v-btn>
            </v-col>
        </v-row>
    </form>
    <v-row v-for="item in data" class="bg-grey-lighten-5 mb-2 mt-4 rounded-xl" align="center">
            <v-col class="w100" >تعداد کل: {{ item.max_usage }}</v-col>
            <v-col class="w100" >تعداد مصرف شده: {{ item.current_usage }}</v-col>
            <v-col class="w100" >نوع تخفیف : {{ item.is_percentage == true ? 'درصدی' : 'مبلغ ثابت' }}</v-col>
            <v-col class="w100" >مقدار : {{ parseInt(item.amount) }}</v-col>
            <v-col class="w100" >کد تخفیف : {{ item.code }}</v-col>
            <v-col class="d-flex justify-space-between align-center">

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
        
          
            discountCode: '',
            discountType: 'درصدی',
            discountAmount: null,
            discountMaxUsage: null,
            discountTypes: [
                [ 'درصدی'],
                [ 'مبلغ ثابت' ]
            ]
        }
    },
    computed: {
        discountLabel() {
            return this.discountType == 'درصدی' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)';
        },
        formIsValid() {
            return this.discountMaxUsage && this.discountAmount;
        }
    },
    methods: {

        async createDiscountCode() {
            this.loadingColor = true
            axios.post(`${apiStore().address}/api/product/seller-panel/discount/list-create/`,
                {
                    amount: this.discountAmount,
                    max_usage: this.discountMaxUsage,
                    is_percentage: this.discountType=='درصدی'? true : false,
                }, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
                .then(response => {
                    this.loadingColor = false
                 
           
                        this.data.push({
                            id :  response.data.id,
                            code :  response.data.data.code,
                            amount :  response.data.data.amount,
                            max_usage :  response.data.data.max_usage,
                            current_usage :  response.data.data.current_usage,
                            is_percentage :  response.data.data.is_percentage
                        })
                   
                })
                .catch(error => {
                    // handle error
                    console.error('Error:', error);
                });
        },
    },
    mounted(){
        
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