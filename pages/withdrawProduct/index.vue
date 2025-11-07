<template>
  <v-snackbar v-model="snackbar" class="rtl" color="success" elevation="24" rounded="lg">
    عملیات با موفقیت انجام شد
  </v-snackbar>

  <v-card flat>
    <v-container>
      <v-row class="rtl">
        <v-col cols="12" md="8" class="d-flex align-center mt-md-6" style="direction: rtl;">
          <v-avatar color="primary" rounded="lg" size="50">
            <ArrowDownIcon />
          </v-avatar>
          <div class="px-5 font-weight-bold text-h4">برداشت‌ها</div>
        </v-col>
        <v-col cols="12" md="4" class="mt-4 mt-md-6">
          <v-card variant="tonal" color="primary" rounded="lg">
            <v-card-text class="rtl">
              <div class="d-flex justify-space-between">
                <div class="text-body-2">موجودی قابل برداشت</div>
                <div class="text-h6 font-weight-bold">{{ formatPrice(walletInfo?.cash/10) }}<span class="text-xs font-weight-light px-1">تومان</span></div>
              </div>
              <!-- <div class="d-flex justify-space-between mt-2">
                <div class="text-body-2">در انتظار تسویه</div>
                <div class="text-body-1">{{ formatPrice(walletInfo?.on_hold) }}</div>
              </div> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-card>
      <v-card-text>
        <!-- Actions -->
        <v-container class="pt-0 mt-0">
          <v-row align="center" class="rtl">
            <v-col cols="12" md="6" class="d-flex align-center">
              <v-btn @click="withdrawDialog = true" variant="flat" color="primary" height="50" rounded="lg">
                درخواست برداشت
              </v-btn>
              <v-btn class="mr-3" variant="tonal" color="primary" height="50" rounded="lg" @click="bankDialog = true">
                افزودن حساب بانکی
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <!-- Withdrawals list -->
        <div class="d-flex align-center rtl mt-8 mb-4">
          <div class="text-h6 font-weight-bold ">درخواست‌های برداشت</div>
        </div>

        <div class="d-flex justify-center">
          <v-progress-circular
            v-if="loadingWithdrawals"
            bg-color="transparent"
            :size="55"
            class="ma-10"
            :width="5"
            color="primary"
            indeterminate
          />
        </div>

        <v-alert
          v-if="!loadingWithdrawals && withdrawals.length === 0"
          color="primary"
          icon="fa fa-info"
          variant="tonal"
          border="start"
          class="rtl border-opacity-100 my-6"
        >
          <div class="text-sm irsa">درخواستی ثبت نشده است</div>
        </v-alert>

        <v-container v-if="!loadingWithdrawals && withdrawals.length">
          <v-table class="rtl">
            <thead>
              <tr>
                <th class="text-subtitle-1 font-weight-bold">تاریخ ثبت</th>
                <th class="text-subtitle-1 font-weight-bold">وضعیت</th>
                <th class="text-subtitle-1 font-weight-bold">کد رهگیری</th>
                <th class="text-subtitle-1 font-weight-bold">بانک / شبا</th>
                <th class="text-subtitle-1 font-weight-bold text-right">مبلغ</th>
                <th class="text-subtitle-1 font-weight-bold text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in withdrawals" :key="w.id">
                <td>{{ formatDate(w.created_at) }}</td>
                <td>
                  <v-chip :color="statusColor(w.status)" size="small" variant="flat" rounded="lg">
                    {{ mapWithdrawStatus(w.status) }}
                  </v-chip>
                </td>
                <td>{{ w.tracking_code || '—' }}</td>
                <td>
                  <div class="d-flex flex-column">
                    <span>{{ w.bank_account?.bank_name || '—' }}</span>
                    <small class="text-disabled">{{ w.bank_account?.iban || '—' }}</small>
                  </div>
                </td>
                <td class="text-right">{{ formatPrice(w.amount/10) }} <span class="text-xs font-weight-light px-1">تومان</span> </td>
                <td class="text-right">
                  <v-btn
                    v-if="isCancellable(w.status)"
                    size="small"
                    variant="tonal"
                    color="error"
                    rounded="lg"
                    :loading="cancelLoadingId === w.id"
                    @click="cancelWithdrawal(w.id)"
                  >
                    لغو
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div class="text-center mt-8" v-if="withdrawalsPrev || withdrawalsNext">
            <v-btn
              variant="flat"
              rounded="lg"
              color="primary"
              class="mx-1"
              :disabled="!withdrawalsPrev"
              @click="goWithdrawPage(withdrawalsPrev)"
            >
              صفحه قبل
            </v-btn>
            <v-btn
              variant="flat"
              rounded="lg"
              color="primary"
              class="mx-1"
              :disabled="!withdrawalsNext"
              @click="goWithdrawPage(withdrawalsNext)"
            >
              صفحه بعد
            </v-btn>
          </div>
        </v-container>
      </v-card-text>
    </v-card>
  </v-card>

  <!-- Withdraw Dialog -->
  <v-dialog v-model="withdrawDialog" max-width="560">
    <v-card rounded="xl">
      <v-card-title class="rtl pa-5">درخواست برداشت</v-card-title>
      <v-card-text class="rtl">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="withdraw.bank_account"
              :items="bankAccounts"
              item-title="title"
              item-value="id"
              label="انتخاب حساب بانکی"
              variant="outlined"
              rounded="lg"
              :loading="loadingBanks"
              density="comfortable"
              :error-messages="withdrawErrors.bank_account"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="withdraw.amount"
              label="مبلغ برداشت (ریال)"
              type="number"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              :suffix="withdraw.amount ? 'ریال' : ''"
              :error-messages="withdrawErrors.amount"
            />
          </v-col>
          <v-col cols="12" v-if="withdrawErrors.non_field_errors.length">
            <v-alert type="error" variant="tonal" class="rtl" border="start" rounded="lg">
              {{ withdrawErrors.non_field_errors.join('، ') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="rtl px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" rounded="lg" @click="withdrawDialog = false">انصراف</v-btn>
        <v-btn color="primary" rounded="lg" :disabled="!withdraw.bank_account || !withdraw.amount" @click="requestWithdrawal">
          ثبت درخواست
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add Bank Account Dialog -->
  <v-dialog v-model="bankDialog" max-width="560">
    <v-card rounded="xl">
      <v-card-title class="rtl pa-5">افزودن حساب بانکی</v-card-title>
      <v-card-text class="rtl">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="bankForm.bank_name" :error-messages="bankErrors.bank_name" label="نام بانک" variant="outlined" rounded="lg" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="bankForm.iban" :error-messages="bankErrors.iban" label="شماره شبا (با IR)" variant="outlined" rounded="lg" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="bankForm.owner_name" :error-messages="bankErrors.owner_name" label="نام صاحب حساب" variant="outlined" rounded="lg" />
          </v-col>
          <v-col cols="12" v-if="bankErrors.non_field_errors.length">
            <v-alert type="error" variant="tonal" class="rtl" border="start" rounded="lg">
              {{ bankErrors.non_field_errors.join('، ') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="rtl px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" rounded="lg" @click="bankDialog = false">بستن</v-btn>
        <v-btn color="primary" rounded="lg" :loading="creatingBank" @click="createBankAccount">ذخیره</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ArrowDownIcon } from 'vue-tabler-icons';
import axios from 'axios';
import { apiStore } from '~/store/api';
import { useUserStore } from '~/store/user';

export default {
  components: { ArrowDownIcon },
  data() {
    return {
      snackbar: false,

      // Wallet
      walletInfo: null,

      // Bank accounts
      bankAccounts: [],
      loadingBanks: true,
      bankDialog: false,
      creatingBank: false,
      bankForm: { bank_name: '', iban: '', owner_name: '' },
      bankErrors: { bank_name: [], iban: [], owner_name: [], non_field_errors: [] },

      // Withdrawals
      withdrawals: [],
      loadingWithdrawals: true,
      withdrawalsNext: null,
      withdrawalsPrev: null,
      cancelLoadingId: null,

      // Withdraw dialog + form
      withdrawDialog: false,
      withdraw: { bank_account: null, amount: null },
      withdrawErrors: { bank_account: [], amount: [], non_field_errors: [] },
    };
  },
  methods: {
    authHeaders() {
      return {
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${useUserStore().userToken}`,
        },
      };
    },

    setFieldErrors(target, payload) {
      Object.keys(target).forEach((k) => (target[k] = []));
      if (!payload || typeof payload !== 'object') return;
      for (const [field, messages] of Object.entries(payload)) {
        const arr = Array.isArray(messages) ? messages : [String(messages)];
        if (field in target) target[field] = arr;
        else if (field === 'detail' || field === 'non_field_errors') target.non_field_errors = arr;
        else target.non_field_errors.push(`${field}: ${arr.join('، ')}`);
      }
    },

    async fetchWalletInfo() {
      try {
        const { data } = await axios.get(`${apiStore().address}/api/wallet/wallet-info/`, this.authHeaders());
        this.walletInfo = data;
      } catch {
        this.walletInfo = { available: null, on_hold: null };
      }
    },

    async fetchBankAccounts() {
      this.loadingBanks = true;
      try {
        const { data } = await axios.get(`${apiStore().address}/api/wallet/bank-accounts/manage/`, this.authHeaders());
        const results = Array.isArray(data) ? data : data?.results || [];
        this.bankAccounts = results.map((b) => ({
          id: b.id,
          title: (b.bank_name ? `${b.bank_name} • ` : '') + (b.iban || ''),
          raw: b,
        }));
      } finally {
        this.loadingBanks = false;
      }
    },
    async createBankAccount() {
      this.creatingBank = true;
      this.setFieldErrors(this.bankErrors, {});
      try {
        await axios.post(
          `${apiStore().address}/api/wallet/bank-accounts/manage/`,
          { bank_name: this.bankForm.bank_name, iban: this.bankForm.iban, owner_name: this.bankForm.owner_name },
          this.authHeaders()
        );
        this.snackbar = true;
        this.bankDialog = false;
        this.bankForm = { bank_name: '', iban: '', owner_name: '' };
        await this.fetchBankAccounts();
      } catch (e) {
        if (e.response && e.response.status >= 400) this.setFieldErrors(this.bankErrors, e.response.data);
        else this.bankErrors.non_field_errors = ['مشکلی پیش آمد. دوباره تلاش کنید.'];
      } finally {
        this.creatingBank = false;
      }
    },

    async fetchWithdrawals(url = null) {
      this.loadingWithdrawals = true;
      try {
        const endpoint = url || `${apiStore().address}/api/wallet/withdrawals/`;
        const { data } = await axios.get(endpoint, this.authHeaders());
        this.withdrawals = data.results || [];
        this.withdrawalsNext = data.next || null;
        this.withdrawalsPrev = data.previous || null;
      } finally {
        this.loadingWithdrawals = false;
      }
    },
    goWithdrawPage(url) {
      if (url) this.fetchWithdrawals(url);
    },

    async requestWithdrawal() {
      this.setFieldErrors(this.withdrawErrors, {});
      try {
        await axios.post(
          `${apiStore().address}/api/wallet/withdrawals/`,
          { bank_account: this.withdraw.bank_account, amount: Number(this.withdraw.amount) },
          this.authHeaders()
        );
        this.withdrawDialog = false;
        this.snackbar = true;
        await Promise.all([this.fetchWithdrawals(), this.fetchWalletInfo()]);
      } catch (e) {
        if (e.response && e.response.status >= 400) this.setFieldErrors(this.withdrawErrors, e.response.data);
        else this.withdrawErrors.non_field_errors = ['مشکلی پیش آمد. دوباره تلاش کنید.'];
      }
    },

    async cancelWithdrawal(id) {
      if (!id) return;
      this.cancelLoadingId = id;
      try {
        await axios.post(`${apiStore().address}/api/wallet/withdrawals/${id}/cancel/`, {}, this.authHeaders());
        await Promise.all([this.fetchWithdrawals(), this.fetchWalletInfo()]);
      } finally {
        this.cancelLoadingId = null;
      }
    },

    isCancellable(status) {
      return ['pending', 'created', 'processing'].includes(String(status || '').toLowerCase());
    },
    mapWithdrawStatus(s) {
      const key = String(s || '').toLowerCase();
      return (
        {
          pending: 'در انتظار',
          paid : 'پرداخت شده',
          approved : 'انجام‌شده',
          rejected: 'رد شده',
          canceled: 'لغو شده',
        }[key] || s || '—'
      );
    },
    statusColor(s) {
      const key = String(s || '').toLowerCase();
      if (['paid', 'approved'].includes(key)) return 'success';
      if (['rejected', 'canceled', 'cancelled'].includes(key)) return 'error';
      if (['processing', 'pending'].includes(key)) return 'info';
      if (['processing'].includes(key)) return 'warning';
      return 'warning';
    },
    formatPrice(v) {
      if (v === null || v === undefined) return '—';
      return Number(v).toLocaleString('en-US');
    },
    formatDate(iso) {
      if (!iso) return '—';
      try {
        const d = new Date(iso);
        return d.toLocaleDateString('fa-IR');
      } catch {
        return iso;
      }
    },
  },

  async mounted() {
    await Promise.all([this.fetchWalletInfo(), this.fetchBankAccounts(), this.fetchWithdrawals()]);
  },
};
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
