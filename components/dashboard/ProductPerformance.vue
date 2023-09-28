<script setup lang="ts">
import {productPerformance} from '@/data/dashboard/dashboardData';
</script>
<template>
    <v-card rounded="lg" elevation="10" class="">
        <v-card-item class="pa-6">
        <v-card-title class="text-h5 rtl pt-sm-1 pb-3">فروش های اخیر</v-card-title>
        <v-table class="month-table rtl">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-bold"></th>
                    <th class="text-subtitle-1 font-weight-bold">خریدار</th>
                    <th class="text-subtitle-1 font-weight-bold">محصول</th>
                    <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                    <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                </tr>
            </thead>
            <tbody>
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
                        <v-chip  :class="'text-body-2 px-3 py-1 bg-' + item.statuscolor " color="white"  size="x-small" >{{
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
</template>
