<script setup lang="ts">







import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios'; // Import axios for API requests

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const secondary = theme.current.value.colors.secondary;

const chartData = ref([]); // Create a ref to store API data
const loading = ref(true); 

// Fetch data from API on component mount
onMounted(async () => {
    try {
        const response = await axios.get(`${apiStore().address}/api/order/seller-panel/last-week-sales/`, {
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Token ${useUserStore().userToken}`
            },
        }); // Replace with your API endpoint
        chartData.value = response.data; // Set chartData with API response
        setTimeout(() => {
            loading.value = false
        }, 500);
    } catch (error) {
        console.error('Error fetching data from API', error);
    }
});

const chartOptions = computed(() => {
    const categories = chartData.value.map(item => item.day); // Extract days from API response
    const seriesData = chartData.value.map(item => item.total_price/10); // Extract total_price from API response

    return {
        series: [
            { name: "درآمد:", data: seriesData },
        ],
        chartOptions: {
            grid: {
                borderColor: 'rgba(0,0,0,0.1)',
                strokeDashArray: 3,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
            },
            plotOptions: {
                bar: { horizontal: false, columnWidth: "35%", borderRadius: [8] },
            },
            colors: [primary, secondary],
            chart: {
                type: "bar",
                height: 370,
                offsetX: -15,
                toolbar: { show: true },
                foreColor: "#adb0bb",
                fontFamily: 'inherit',
                sparkline: { enabled: false },
            },
            dataLabels: { enabled: false },
            markers: { size: 0 },
            legend: { show: false },
            xaxis: {
                type: "category",
                categories: categories,
                labels: {
                    style: { cssClass: "grey--text lighten-2--text fill-color" },
                },
            },
            yaxis: {
                show: true,
      

                tickAmount: 4,
                labels: {
                    style: {
                        cssClass: "grey--text lighten-2--text fill-color",
                    },
                },
            },
            stroke: {
                show: true,
                width: 3,
                lineCap: "butt",
                colors: ["transparent"],
            },
            tooltip: { theme: "light" },

            responsive: [
                {
                    breakpoint: 600,
                    options: {
                        plotOptions: {
                            bar: {
                                borderRadius: 3,
                            }
                        },
                    }
                }
            ]
        },
    };
});
</script>
<template>
    <v-card elevation="10" rounded="lg" class="withbg">
        <v-card-item>
            <div class="rtl d-sm-flex align-center justify-space-between pt-sm-2">
                <div><v-card-title class="text-h5 irsa"> فروش هفته ی اخیر</v-card-title></div>

            </div>
            <div class="mt-6" v-if="loading == false">
                <ClientOnly>
                    <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
                    </apexchart>
                </ClientOnly>
            </div>
        <v-card v-else height="370" class="mt-6"></v-card>

        </v-card-item>
    </v-card>
</template>