
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
                            <v-btn @click=" statusCheck == '' ? statusCheck = 'none' : statusCheck = ''; searchData()"
                                :variant="statusCheck == '' ? 'tonal' : 'outlined'" color="primary" height="50px"
                                class="ms-3 " rounded="lg">
                                <div class="d-flex justify-center " v-if="statusCheck == 'none'">
                                    <CheckIcon class="me-3" />
                                    <div>
                                        ارسال نشده‌ها
                                    </div>
                                </div>
                                <span v-else>ارسال نشده‌ها</span>
                            </v-btn>

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
                            <th class="text-subtitle-1 font-weight-bold"></th>
                            <th class="text-subtitle-1 font-weight-bold">خریدار</th>
                            <th class="text-subtitle-1 font-weight-bold">محصول</th>
                            <th class="text-subtitle-1 font-weight-bold">تعداد</th>
                            <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                            <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in data" v-if="!loading" :key="item.name" class="month-item">
                            <td>
                                <p class="text-15 font-weight-medium">{{ item.id }}</p>
                            </td>
                            <td>
                                <div class="">
                                    <v-dialog width="900">
                                        <template v-slot:activator="{ props }">
                                            <h6 v-bind="props" class="text-body-1 text-muted">{{ item.author.full_name }}
                                            </h6>
                                            <div v-bind="props" class="text-13 mt-1 text-muted">{{ item.author.username }}
                                            </div>
                                        </template>

                                        <template v-slot:default="{ isActive }">
                                            <v-card class="px-15 rounded-lg my-20 " title="">
                                                <EditPayment />
                                            </v-card>
                                        </template>
                                    </v-dialog>
                                </div>
                            </td>
                            <td>
                                <v-dialog width="900">
                                    <template v-slot:activator="{ props }">
                                        <h6 v-bind="props" class="text-body-1 text-muted">{{ item.product.title }}</h6>
                                    </template>

                                    <template v-slot:default="{ isActive }">
                                        <v-card class="px-15 rounded-lg my-20 " title="">
                                            <EditPayment />
                                        </v-card>
                                    </template>
                                </v-dialog>
                            </td>
                            <td>
                                <h6 class="text-body-1 text-muted">{{ item.count }}</h6>
                            </td>
                            <td>

                                <v-menu>
                                    <template v-slot:activator="{ props }">

                                        <v-btn :loading="item.id == loadingStatus" density="compact" :ripple="false"
                                            v-bind="props" variant="flat" rounded="pill"
                                            :class="item.status == 'received' ? 'bg-green' : item.status == 'sended' ? 'bg-primary' : 'bg-red'"
                                            class="pa-0">
                                            <v-chip class="text-body-2 px-3 py-1  text-white " size="x-small">
                                                {{ item.status == 'received' ? ' تحویل داده شده' : item.status == 'sended' ?
                                                    ' ارسال شده ' : ' ارسال نشده' }}
                                            </v-chip></v-btn>

                                    </template>
                                    <v-list rounded="lg">
                                        <v-list-item v-for="(itemStatus, index) in items" :key="index"
                                            :value="itemStatus.value"
                                            :class="item.status == itemStatus.value ? 'bg-grey-lighten-3 text-black text-weight-bold ' : ''"
                                            @click="item.status = itemStatus.value; changeStatus(item.id, item.status)">
                                            <v-list-item-title class="text-body-1 rtl"
                                                :class="item.status == itemStatus.value ? 'font-weight-bold ' : ''">{{
                                                    itemStatus.title }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </td>
                            <td>
                                <h6 class="text-h6 text-right">{{ item.price }} تومان</h6>
                            </td>
                        </tr>
                        <tr v-for="item in productPerformance" :key="item.name" class="month-item">
                            <td>
                                <p class="text-15 font-weight-medium">{{ item.id }}</p>
                            </td>
                            <td>
                                <div class="">
                                    <h6 class="text-subtitle-1 font-weight-bold">{{ item.name }}</h6>
                                    <div class="text-13 mt-1 text-muted">{{ item.post }}</div>
                                </div>
                            </td>
                            <td>
                                <h6 class="text-body-1 text-muted">{{ item.pname }}</h6>
                            </td>
                            <td>
                                <v-chip :class="'text-body-2 px-3 py-1 bg-' + item.statuscolor" color="white"
                                    size="x-small">{{
                                        item.status
                                    }}</v-chip>
                            </td>
                            <td>
                                <h6 class="text-h6 text-right">{{ item.budget }} تومان</h6>
                            </td>
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
import EditPayment from '@/pages/payment/edit_payment.vue';
import { productPerformance } from '@/data/dashboard/dashboardData';
import { CoinsIcon, SearchIcon, SortDescending2Icon, SortAscending2Icon, CheckIcon, PencilIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import axios from "axios";

export default {
    components: {
        SortDescending2Icon,
        SortAscending2Icon,
        CoinsIcon,
        SearchIcon,
        CheckIcon,
        PencilIcon,
        EditPayment,
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
            axios.put(`http://192.168.1.106:8000/api/order/OrderUpdateStatus/${id}/`, { status: status }, {
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

            axios.get(`http://192.168.1.106:8000/api/order/Order_payed_list_admin_search/?search=${this.search_text}&ordering=${this.order == false ? 'id' : '-id'}&status=${this.statusCheck}`, {
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