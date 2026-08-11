
<template>
   <div v-if="loading == false">
     <v-alert
         v-for="notification in notifications"
         :key="notification.id"
         class="rtl mb-3"
         :title="notification.title || 'اطلاعیه فروشگاه'"
         :text="notification.body"
         type="info"
         variant="tonal"
         border="start"
     >
         <NuxtLink v-if="notification.url" :to="notification.url" class="text-primary text-decoration-none">
             مشاهده
         </NuxtLink>
     </v-alert>
     <v-alert
         v-if="cash < fee_product"
         closable
         class="rtl"
         title="کمبود وجه"
         text="موجودی کیف پول شما به پایان رسیده است. فروش شما تا زمان افزایش موجودی کیف پول متوقف شد."
         type="error"
         variant="tonal"
         border="start"
     ></v-alert>
     <v-alert
         v-else-if="cash < fee_product * 28"
         closable
         class="rtl "
         title="کمبود وجه"
         text="موجودی کیف پول شما در حال اتمام است. لطفاً هرچه سریعتر نسبت به افزایش موجودی خود اقدام کنید تا بتوانید به فروش خود ادامه دهید."
         type="warning"
         variant="tonal"
         border="start"
     ></v-alert>
   </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ArrowDownIcon, WalletIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import axios from 'axios';


export default {
    components: {
        ArrowDownIcon,
        WalletIcon
    },
    computed: {
        address() {
            return apiStore().address
        },  shop_username() {
            return useUserStore().usernameShop
        },
    },
    data(){
        return{
            amount:null,
        }
    },
    setup() {
        const cash = ref(0);
        const loading = ref(true);
        const fee_product = ref(0);
        const notifications = ref([]);

        onMounted(async () => {
            try {
                const response = await axios.get(`${apiStore().address}/api/wallet/wallet-info/`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Token ${useUserStore().userToken}`,
                    },
                });
                cash.value = response.data.cash;
                const config = await axios.get(`${apiStore().address}/api/config/`, { headers: { Authorization: `Token ${useUserStore().userToken}` } });
                fee_product.value = Number(config.data.fee_product || 0);
            } catch (error) {
                console.error('Error fetching data from API', error);
            } finally {
                loading.value = false;
            }

            try {
                const response = await axios.get(`${apiStore().address}/api/account/notification-list/`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Token ${useUserStore().userToken}`,
                    },
                });
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || response.data.data || [];
                const items = Array.isArray(data) ? data : [];
                notifications.value = items.filter((notification) => (
                    notification.readingStatus !== true && notification.readingStatus !== 'true'
                ));
            } catch (error) {
                console.error('Error fetching shop notifications', error);
            }
        });

        return {
            cash, loading, fee_product, notifications
        };
    },
};
</script>
