<template>
    
  <v-card elevation="10" rounded="lg" height="480px">
    <v-container>
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
                            <th class="text-subtitle-1 font-weight-bold"></th>
                            <th class="text-subtitle-1 font-weight-bold">خریدار</th>
                            <th class="text-subtitle-1 font-weight-bold">محصول</th>
                            <th class="text-subtitle-1 font-weight-bold">تعداد</th>
                            <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                            <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in data" :key="item.name" class="month-item ">
                        <PaymentRow :data="item"/>
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
            data: [],
            loading: true,
            search_text: '',
            order: false,
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
            axios.put(`${apiStore().address}/api/order/OrderUpdateStatus/${id}/`, { status: status }, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            })
            this.loadingStatus = 0

        },
        searchData() {
            this.loading = true

            axios.get(`${apiStore().address}/api/order/Order_payed_list_admin_search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}&status=${this.statusCheck}`, {
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                this.loading = false
                this.data = response.data
            })
        }
    }, async mounted() {
        this.searchData()
    }
}
</script>