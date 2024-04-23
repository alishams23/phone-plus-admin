<script >

/*Call Components*/
import SalesOverview from '~/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '~/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '~/components/dashboard/MonthlyEarnings.vue';
import RecentNotification from '~/components/dashboard/RecentNotification.vue';
import PaymentTable from '~/components/dashboard/PaymentTable.vue';
import FirstLoginPopUp from '~/components/dashboard/FirstLoginPopUp.vue';
import RecentProduct from '~/components/dashboard/RecentProduct.vue';
import axios from "axios";
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

export default {
    name: "index",
    components: {
    SalesOverview,
    YearlyBreakup,
    MonthlyEarning,
    RecentNotification,
    PaymentTable,
    FirstLoginPopUp,
    RecentProduct
    },
    data() {
        return {
            open: null, 
        };
    },
    methods: {
        getData() {
            axios.get(`${apiStore().address}/api/account/seller-panel/shop-retrieve/`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Token ${useUserStore().userToken}`
                },
            }).then((response) => {
                console.log(response)
                this.loading = false
                this.open = response.data[0].is_first_login
            })
        },
    },
    mounted() {
        this.getData()
    },
}
</script>
<template>
    
  <v-container>
    <v-row>
        <v-col cols="12">
            <v-row>
                <!-- First Login PopUp -->
                <v-dialog width="900" persistent v-model="open">
                    <v-card class="px-3 px-md-15 rounded-lg my-20 " title="">
                        <FirstLoginPopUp @cancel="open = false" />
                    </v-card>
                </v-dialog>

                <!-- Sales overview -->
                <v-col cols="12" lg="8">
                    <SalesOverview />
                </v-col>

                <!-- Yearly Breakup / Monthly Earnings -->
                <v-col cols="12" lg="4">
                    <!-- <div class="mb-6">
                        <YearlyBreakup />
                    </div> -->
                    <div>
                        <MonthlyEarning />
                    </div>
                </v-col>

                <!-- Recent transaction -->
                <!-- <v-col cols="12" lg="4">
                    <RecentNotification />
                </v-col> -->

                <!-- Payment Table -->
                <v-col cols="12" lg="12">
                    <PaymentTable />
                </v-col>

                <!-- Product Cards -->
                <v-col cols="12">
                   <div class="d-flex justify-space-between align-center">
                    
                    <v-btn variant="outlined" to="/products" rounded="xl" size="small">
                       همه ی محصولات
                    </v-btn>
                    <div class="rtl font-weight-black py-5">
                        محصولات اخیر
                    </div>
                   </div>
                    <RecentProduct />
                </v-col>
                
            </v-row>
        </v-col>
   
    </v-row>
  </v-container>
</template>