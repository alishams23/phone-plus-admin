<template>
    <v-snackbar v-model="snackbar" class=" rtl" color="success" elevation="24" rounded="lg">
        وضعیت با موفقیت ویرایش شد
    </v-snackbar>
  <v-card elevation="10" rounded="lg" >
     <h3 class="pt-6 ps-4" dir="rtl">پرداخت محصولات فیزیکی</h3>
    <v-container v-if="data.length == 0 && loading == false">
        <v-alert  color="primary" icon="fa fa-info" variant="tonal"
            border="start" class="rtl border-opacity-100 my-10">
            <div class="text-sm  irsa">
                پرداختی وجود ندارد
            </div>
        </v-alert>
    </v-container>
    <v-container>
        <v-card v-if="data.length != 0" elevation="0" class="">
            <v-card-item class="pa-6">
                <v-card-title class="text-h5 rtl pt-sm-1 pb-3 font-weight-black">فروش های اخیر  </v-card-title>
                <v-table class="month-table rtl">
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-bold">تاریخ سفارش</th>
                                                    <th class="text-subtitle-1 font-weight-bold">شماره سفارش</th>
                                                    <th class="text-subtitle-1 font-weight-bold"> کد پیگیری خرید</th>
                                                    <th class="text-subtitle-1 font-weight-bold">خریدار</th>
                                                    <th class="text-subtitle-1 font-weight-bold">محصول</th>
                                                    <th class="text-subtitle-1 font-weight-bold">تعداد</th>
                                                    <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                                                    <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in data.slice(0,4)" :key="item.name" class="month-item ">
                        <PaymentRow :data="item"/>
                    </tr>
                    </tbody>
                </v-table>
            </v-card-item>
        </v-card>
    </v-container>
    <div class="d-flex justify-center">
        <v-progress-circular v-if="loading" bg-color="transparent" :size="55" class="ma-10" :width="5" color="primary"
            indeterminate>
        </v-progress-circular>
    </div>
  </v-card>
</template>
<script >
import  PaymentRow  from '~/components/shared/PaymentRow.vue';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from "axios";

export default {
    components: {
        PaymentRow,
    },
    data() {
        return {
            snackbar: false,
            data: [],
            loading: true,
            search_text: '',
            order: true,
            loadingStatus: 0,

            items: [
                { title: 'تحویل داده شده', value: 'received' },
                { title: 'ارسال شده ', value: 'sended' },
                { title: 'ارسال نشده', value: 'none' },

            ],
            statusCheck: ''
        }
    },
    methods: {
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
        searchData() {
            this.loading = true

            axios.get(`${apiStore().address}/api/order/seller-panel/order-list-search/?page=1&search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}&status=${this.statusCheck}`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading = false
                this.data = response.data.results
            })
        }
    }, async mounted() {
        this.searchData()
    }
}
</script>