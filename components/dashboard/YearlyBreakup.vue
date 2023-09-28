<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { ArrowDownIcon, WalletIcon } from 'vue-tabler-icons';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const lightprimary = theme.current.value.colors.lightprimary;
const chartOptions = computed(() => {
    return {
        labels: ['series-1', 'series-2', 'series-3'],
        chart: {
            type: 'donut',
            fontFamily: `inherit`,
            foreColor: '#a1aab2',
            toolbar: {
                show: false
            }
        },
        colors: [primary, lightprimary, '#F9F9FD'],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '75%',
                    background: 'transparent'
                }
            }
        },
        stroke: {
            show: false
        },
        
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        tooltip: { theme: "light", fillSeriesColor: false },
    };
});
const Chart = [38, 40, 25];
</script>
<template>
    <v-card elevation="10"   rounded="lg"  class="bg-primary  rtl">
        <v-card-item >
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5 font-weight-black rtl">کیف پول</v-card-title>
                <div>
                    <WalletIcon size="40"/>
                </div>
            </div>
      
                    <div class="mt-6">
                        <h3 class="text-h3">36,000,000</h3>
                        <div class="mt-1">
                     
                            <span class="text-subtitle-1 opacity-50 text-muted ml-2">تومان</span>
                        </div>
                        <div class="d-flex justify-end align-center mt-4 ">
                            <v-btn  variant="tonal" size="small" class="rounded-xl" >
                                <template v-slot:prepend><ArrowDownIcon size="17"/></template>
                                برداشت پول
                            </v-btn>
                            
                        </div>
                    </div>
              
            
      
        </v-card-item>
    </v-card>
</template>