
<template>
    <v-container>
        <v-row align="center">
            <v-col cols="5">
                <v-locale-provider rtl>
                    <v-text-field v-model="search_text" @update:model-value="searchData" label="جستجو" rounded="lg"
                        persistent-hint variant="outlined" color="primary" dense class="mt-5 text-body-2">
                        <template v-slot:prepend-inner>
                            <SearchIcon color="gray" />
                        </template>
                        <template v-slot:prepend>
                            <v-btn @click="order = !order; searchData()" variant="tonal" color="primary" rounded="lg"
                                size="50">
                                <SortDescending2Icon v-if="order" />
                                <SortAscending2Icon v-if="!order" />
                            </v-btn>
                            <!-- <v-btn @click=" statusCheck == '' ? statusCheck = 'none' : statusCheck = ''; searchData()"
                                :variant="statusCheck == '' ? 'tonal' : 'outlined'" color="primary" height="50px"
                                class="ms-3 " rounded="lg">
                                <div class="d-flex justify-center " v-if="statusCheck == 'none'">
                                    <CheckIcon class="me-3" />
                                    <div>
                                        ارسال نشده‌ها
                                    </div>
                                </div>
                                <span v-else>ارسال نشده‌ها</span>
                            </v-btn> -->

                        </template>
                    </v-text-field>
                </v-locale-provider>

            </v-col>
            <v-col cols="7" class="rtl d-flex align-center">
                <v-avatar color="primary" rounded="lg" size="50">
                    <CoinsIcon />
                </v-avatar>
                <div class=" px-5 font-weight-bold text-h4">
                    پرداخت‌ها
                </div>
            </v-col>
        </v-row>
        <v-alert v-if="data.length == 0 && loading == false" color="primary" icon="fa fa-info" variant="tonal"
            border="start" class="rtl border-opacity-100 my-10">
            <div class="text-sm  font-weight-black irsa">
                پرداختی وجود ندارد
            </div>
        </v-alert>
    </v-container>
    <v-container>
        <v-card v-if="data.length != 0" elevation="0" class="">
            <v-card-item class="pa-6">
                <v-card-title class="text-h5 rtl pt-sm-1 pb-3 font-weight-black"> تمامی فروش‌ها </v-card-title>
                <v-table class="month-table rtl">
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-bold">شماره سفارش</th>
                            <th class="text-subtitle-1 font-weight-bold">خریدار</th>
                            <th class="text-subtitle-1 font-weight-bold">محصول دیجیتال</th>
                            <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in data" :key="item.name" class="month-item ">
                        <PaymentRowDigitalProduct :data="item" />
                    </tr>
                </tbody>
                </v-table>
            </v-card-item>
        </v-card>
    </v-container>
    <div class="d-flex justify-center">
        <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="7" color="primary"
            indeterminate>
        </v-progress-circular>
    </div>
</template>


<script>
import  PaymentRowDigitalProduct  from '@/components/shared/PaymentRowDigitalProduct.vue';
import { CoinsIcon, SearchIcon, SortDescending2Icon, SortAscending2Icon, CheckIcon, PencilIcon,UserIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";

export default {
    components: {
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
            data: [],
            loading: true,
            search_text: '',
            order: false,
        }
    },
    methods: {
        searchData() {
            this.loading = true

            axios.get(`${apiStore().address}/api/order/admin/order-payed-digital-product-list-search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log('search');
                this.loading = false
                this.data = response.data
            })
        }
    }, async mounted() {
        this.searchData()
    }
}
</script>