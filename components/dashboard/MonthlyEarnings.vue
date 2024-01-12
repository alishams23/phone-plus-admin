<script setup lang="ts">





import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { CurrencyDollarIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import axios from 'axios'; // Import axios for API requests

const theme = useTheme();
const secondary = theme.current.value.colors.secondary;

/* Chart */
const areachartOptions = computed(() => {
  return {
    
    chart: {
      type: 'area',
      height: 60,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    colors: [secondary],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: 'light',
      x: {
        show: true,
      },
    },
  };
});

const areaChart = ref({
  series: [
    {
      name: 'درآمد:',
      data: [0, 0, 0, 0, 0, 0, 0,], // Initial data
    },
  ],
});

// Function to update the chart data
const updateChartData = (apiResponse) => {
  areaChart.value.series[0].data = apiResponse.map((item) => item.total_price);
};

// Fetch data from the API
const fetchData = async () => {
  try {
    const response = await axios.get('http://192.168.1.106:8000/api/order/last-week-sales/', {
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Token ${useUserStore().userToken}`
            },
        })// Replace with your API endpoint
    const data = await response.data;
    updateChartData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Call fetchData on component mount
onMounted(() => {
  fetchData();
});
</script>
<template>
    <v-card elevation="10" rounded="lg" class="withbg">
        <v-card-item>
            <div class="d-flex align-center justify-space-between pt-sm-2 rtl">
                <v-card-title class="text-h5">درآمد ماهانه</v-card-title>
                <v-btn size="large" icon elevation="10"  class="bg-secondary">
                    <v-avatar size="large" class="text-white">
                        <CurrencyDollarIcon size="25" />
                    </v-avatar>
                </v-btn>
            </div>
            <v-row>
                <v-col cols="12">
                    <div class="mt-2 ">
                        <h3 class="text-h3">6,000,000</h3>
                       
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
        <div class="mt-3">
            <ClientOnly>
            <apexchart type="area" height="100" :options="areachartOptions" :series="areaChart.series"> </apexchart>
        </ClientOnly>
        </div>
    </v-card>
</template>
