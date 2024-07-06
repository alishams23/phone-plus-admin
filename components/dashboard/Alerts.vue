
<template>
   <div v-if="loading == false">
     <v-alert
         v-if="cash < 18000"
         closable
         class="rtl"
         title="کمبود وجه"
         text="موجودی کیف پول شما به پایان رسیده است. لطفاً قبل از ادامه فعالیت، موجودی کیف پول خود را افزایش دهید."
         type="error"
         variant="tonal"
         border="start"
     ></v-alert>
     <v-alert
         v-else-if="cash < 500000"
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
                loading.value = false;
            } catch (error) {
                console.error('Error fetching data from API', error);
            }
        });

        return {
            cash,loading
        };
    },
};
</script>
