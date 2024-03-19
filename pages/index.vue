<script >

/*Call Components*/
import SalesOverview from '~/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '~/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '~/components/dashboard/MonthlyEarnings.vue';
import RecentNotification from '~/components/dashboard/RecentNotification.vue';
import PaymentTable from '~/components/dashboard/PaymentTable.vue';
import RecentProduct from '~/components/dashboard/RecentProduct.vue';


export default {
name: "index",
components: {SalesOverview,
YearlyBreakup,
MonthlyEarning,
RecentNotification,
PaymentTable,
RecentProduct}}
</script>
<template>
    
  <v-container>
    <v-row>
        <v-col cols="12">
            <v-row>
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