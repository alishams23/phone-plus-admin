<template>
    <v-card elevation="10" rounded="lg" class="bg-primary rtl">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5 font-weight-black rtl">کیف پول</v-card-title>
                <div>
                    <WalletIcon size="40" />
                </div>
            </div>

            <div class="mt-6">
                <h3 class="text-h3">{{ cash }}</h3>
                <div class="mt-1">
                    <span class="text-subtitle-1 opacity-50 text-muted ml-2">تومان</span>
                </div>
                <div class="d-flex justify-end align-center mt-4">
                    <v-btn variant="tonal" size="small" class="rounded-xl">
                        <template v-slot:prepend>
                            <ArrowDownIcon size="17" />
                        </template>
                        برداشت پول
                    </v-btn>
                </div>
            </div>
        </v-card-item>
    </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ArrowDownIcon, WalletIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import axios from 'axios';

export default {
    components: {
        ArrowDownIcon,
        WalletIcon
    },
    setup() {
        const cash = ref(0);

        onMounted(async () => {
            try {
                const response = await axios.get('http://192.168.1.106:8000/api/wallet/wallet-info/', {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Token ${useUserStore().userToken}`,
                    },
                });
                cash.value = response.data.cash;
            } catch (error) {
                console.error('Error fetching data from API', error);
            }
        });

        return {
            cash,
        };
    },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
