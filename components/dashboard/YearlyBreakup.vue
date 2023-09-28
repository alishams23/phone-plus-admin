<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
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
    <v-card elevation="10"  color="#ECF2FF"   class="border  border-primary rounded-lg rtl">
        <v-card-item class="bg-deep-purple-darken-4">
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5 rtl">کیف پول</v-card-title>
            </div>
      
                    <div class="mt-6">
                        <h3 class="text-h3">36,000,000</h3>
                        <div class="mt-1">
                     
                            <span class="text-subtitle-1 text-muted ml-2">تومان</span>
                        </div>
                        <div class="d-flex align-center mt-sm-10 mt-8">
                            <h6 class="text-subtitle-1 text-muted">
                                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="primary"></v-icon> 2022
                            </h6>
                            <h6 class="text-subtitle-1 text-muted pl-5">
                                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="lightprimary"></v-icon> 2023
                            </h6>
                        </div>
                    </div>
              
            
      
        </v-card-item>
    </v-card>
</template>