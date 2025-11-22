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
        </v-expansion-panel>
      </v-expansion-panels>

      <v-expansion-panels class="mb-4 color-block color-add-wrapper" v-model="colorPanel" multiple>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title color="grey-lighten-4">
            <div>افزودن رنگ</div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="color-add-box">
              <AddColor :data="colors" :show-list="false" @change="$emit('update:colors', $event)" />
            </div>
            <p class="text-red text-body-1 pt-2">{{ error }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="colors && colors.length" class="color-list">
        <div
          class="color-item"
          v-for="color in colors"
          :key="color.id || color.title"
          :style="itemStyle(color)"
        >
          <span class="color-swatch" :style="{ background: color.hexcolor || '#ccc' }"></span>
          <div class="color-meta">
            <div class="color-title">{{ color.title }}</div>
            <div class="color-extra">
              <span class="pill price-pill">قیمت: {{ color.price }}</span>
              <span class="pill stock-pill">موجودی: {{ color.count }}</span>
            </div>
          </div>
          <v-btn
            icon
            size="small"
            variant="tonal"
            color="red"
            class="remove-btn"
            @click="$emit('removeColor', color)"
          >
            <TrashIcon size="16" />
          </v-btn>
        </div>
      </div>

      <v-row class="mt-1" dense>
        
        <v-col cols="12" md="6">
          <v-text-field
            label="هزینه ارسال(تومان)"
            :model-value="deliveryFee"
            @update:modelValue="$emit('update:deliveryFee', $event)"
            rounded="lg"
            required
            persistent-hint
            variant="outlined"
            color="primary"
            type="number"
            min="0"
            :rules="deliveryRules"
          />
        </v-col>
        <v-col cols="12" md="6">
          <AddDiscount :value="value" @change="$emit('update:value', $event)" />
        </v-col>
      </v-row>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import AddDiscountcodes from '@/components/section/product/AddDiscountcodes.vue';
import AddColor from '@/components/section/product/AddColor.vue';
import AddDiscount from '@/components/section/product/AddDiscount.vue';
import { TrashIcon } from 'vue-tabler-icons';

export default {
  components: { AddDiscountcodes, AddColor, AddDiscount, TrashIcon },
  props: {
    deliveryFee: {
      type: [Number, String, null],
      default: 0,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    error: {
      type: String,
      default: '',
    },
    colors: {
      type: Array,
      default: () => [],
    },
    discountCodes: {
      type: Array,
      default: () => [],
    },
    deliveryRules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:deliveryFee', 'update:value', 'update:colors', 'update:discountCodes', 'removeColor'],
  data() {
    return {
      colorPanel: [0],
    };
  },
  methods: {
    itemStyle(color) {
      const base = color.hexcolor || '#6c7bff';
      return {
        background: `linear-gradient(135deg, ${base}1a 0%, ${base}33 100%)`,
        borderColor: `${base}4d`,
      };
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

.color-block :deep(.v-expansion-panel) {
  background: #fffdf6;
  border: 1px solid #ffe6bd;
  border-radius: 12px;
}

.color-block :deep(.v-expansion-panel-title) {
  min-height: 56px;
  background: #fff6e8;
  font-weight: 700;
}

.color-list {
  margin-top: 10px;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f4f7ff 100%);
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #dbe3f7;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fbff 100%);
  box-shadow: 0 6px 16px rgba(46, 67, 120, 0.08);
  min-width: 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  max-width: 100%;
}

.color-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(46, 67, 120, 0.12);
}

.color-swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #d9e1f2;
  box-shadow: inset 0 0 0 1px #ffffffcc;
}

.color-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
  color: #1f2d5c;
  flex: 1;
}

.color-title {
  font-weight: 700;
  font-size: 0.95rem;
}

.color-extra {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 0.78rem;
  border: 1px solid #e6ecf5;
}

.price-pill {
  background: #edf2ff;
  color: #1f2d5c;
}

.stock-pill {
  background: #eefaf1;
  color: #2f6b2f;
}

.remove-btn {
  margin-inline-start: auto;
}

@media (max-width: 768px) {
  .color-list {
    grid-template-columns: repeat(1, minmax(220px, 1fr));
  }
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
