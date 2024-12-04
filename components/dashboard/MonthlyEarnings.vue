<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { CurrencyDollarIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from 'axios'; // Import axios for API requests

const theme = useTheme();
const secondary = theme.current.value.colors.secondary;
const totalPriceSum = ref(0);
const loading = ref(true);
function price(value: any) {
  let text
  let chars = Array.from(`${value / 10}`)
  for (let index = 1; index <= chars.length; index++) {
    if (index % 3 == 0) {
      if (chars.length != index) {
        chars[chars.length - index] = `,${chars[chars.length - index]}`;

      }
    }
  }
  return chars.join("");;
}
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
      followCursor: true,
      theme: 'light',
      x: {
        show: false,
      },
      
      
    },
  };
});

const areaChart = ref({
  series: [
    {
      name: 'تومان',
      data: [0, 0, 0, 0, 0, 0, 0,], // Initial data
    },
  ],
});

// Function to update the chart data
const updateChartData = (apiResponse: any[]) => {
  areaChart.value.series[0].data = apiResponse.map((item: { total_price: any; }) => item.total_price);
};

// Fetch data from the API
const fetchData = async () => {
  try {
    const response = await axios.get(`${apiStore().address}/api/order/seller-panel/last-week-sales/`, {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${useUserStore().userToken}`
      },
    })// Replace with your API endpoint
    const data = response.data;
    setTimeout(() => {
      loading.value = false;
    }, 1000);


    for (const entry of data) {
      totalPriceSum.value += entry.total_price;
    }

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
  <v-card elevation="10" rounded="lg">
    <v-card-item>
      <div class="d-flex align-center justify-space-between pt-sm-2 rtl">
        <v-card-title class="text-h5">درآمد ماهانه</v-card-title>
        <v-btn size="large" icon elevation="10" class="bg-secondary">
          <v-avatar size="large" class="text-white">
            <CurrencyDollarIcon size="25" />
          </v-avatar>
        </v-btn>
      </div>
      <v-row>
        <v-col cols="12">
          <div class="mt-2" dir="rtl">
            <h3 class="text-h3">
              {{ price(totalPriceSum) }}
              <span class="text-body-2">تومان</span>
            </h3>
          </div>

        </v-col>
      </v-row>
    </v-card-item>
    <div class="mt-3" v-if="loading == false">
      <ClientOnly>
        <apexchart type="area" height="105" :options="areachartOptions" :series="areaChart.series"> </apexchart>
      </ClientOnly>
    </div>
    <v-card v-else height="105" class="mt-3"></v-card>
  </v-card>
</template>

