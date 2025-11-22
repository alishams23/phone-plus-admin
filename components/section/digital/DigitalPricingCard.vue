<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">قیمت‌گذاری و تخفیف</h4>
      </div>

      <v-expansion-panels class="mb-4 discount-block">
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title color="grey-lighten-4">
            <div>کد تخفیف</div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <AddDiscountcodes :data="discountCodes" @change="$emit('update:discountCodes', $event)" />
          </v-expansion-panel-text>
          <p class="text-red text-body-1 pt-2">{{ error }}</p>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-row class="mt-1" dense>
        <v-col cols="12" md="6">
          <v-text-field
            :label="priceLabel"
            rounded="lg"
            :model-value="price"
            @update:modelValue="$emit('update:price', toNumber($event))"
            required
            type="number"
            persistent-hint
            variant="outlined"
            min="1000"
            color="primary"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-slide-y-transition>
            <v-row class="mb-2">
              <v-col cols="12" md="6">
                <v-checkbox
                  :model-value="discountEnabled"
                  @update:modelValue="$emit('update:discountEnabled', $event)"
                  color="primary"
                  label="دارای تخفیف"
                  class="flex-grow-1"
                />
              </v-col>
              <v-col v-if="discountEnabled" cols="12" md="6">
                <v-text-field
                  label="درصد تخفیف"
                  rounded="lg"
                  :model-value="discountValue"
                  @update:modelValue="$emit('update:discountValue', toNumber($event))"
                  :max="100"
                  min="1"
                  required
                  type="number"
                  persistent-hint
                  variant="outlined"
                  color="primary"
                />
              </v-col>
            </v-row>
          </v-slide-y-transition>
        </v-col>
      </v-row>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import AddDiscountcodes from '@/components/section/product/AddDiscountcodes.vue';

export default {
  components: { AddDiscountcodes },
  props: {
    price: {
      type: [Number, String],
      default: 0,
    },
    priceLabel: {
      type: String,
      default: 'قیمت (تومان)',
    },
    discountEnabled: {
      type: Boolean,
      default: false,
    },
    discountValue: {
      type: [Number, String],
      default: 0,
    },
    discountCodes: {
      type: Array,
      default: () => [],
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: [
    'update:price',
    'update:discountEnabled',
    'update:discountValue',
    'update:discountCodes',
  ],
  methods: {
    toNumber(value) {
      const numeric = Number(value);
      return Number.isNaN(numeric) ? 0 : numeric;
    },
  },
};
</script>

<style scoped>
.panel-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #e4ebff;
  box-shadow: 0 12px 28px rgba(62, 87, 160, 0.06);
  text-align: right;
}

.panel-heading {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f2dbaa;
  margin-bottom: 14px;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
}

.heading-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #3f51b5, #5c6bc0);
  box-shadow: 0 0 0 6px rgba(63, 81, 181, 0.12);
}

.discount-block {
  border-radius: 14px;
  overflow: hidden;
}

.discount-block :deep(.v-expansion-panel) {
  background: #f5f7ff;
  border: 1px solid #e1e6ff;
  border-radius: 12px;
}

.discount-block :deep(.v-expansion-panel-title) {
  min-height: 56px;
  background: #eef2ff;
  font-weight: 700;
}

.discount-block :deep(.v-expansion-panel-text) {
  background: #fdfdff;
}

/* hide native number spinners */
:deep(input[type='number']),
:deep(.v-text-field input[type='number']),
:deep(.v-input input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}
:deep(input[type='number'])::-webkit-outer-spin-button,
:deep(input[type='number'])::-webkit-inner-spin-button,
:deep(.v-text-field input[type='number'])::-webkit-outer-spin-button,
:deep(.v-text-field input[type='number'])::-webkit-inner-spin-button,
:deep(.v-input input[type='number'])::-webkit-outer-spin-button,
:deep(.v-input input[type='number'])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
