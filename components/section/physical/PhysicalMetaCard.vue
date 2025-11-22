<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">دسته‌بندی و نمایش</h4>
      </div>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-locale-provider ltr>
            <AddCategories
              @change="$emit('update:selectedCategories', $event)"
              :selected="selectedCategories"
              :url="categoryUrl"
            />
          </v-locale-provider>
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-center">
          <v-checkbox
            :model-value="pinProfile"
            @update:modelValue="$emit('update:pinProfile', $event)"
            color="primary"
            label="پین بودن در صفحه ی پروفایل شما"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import AddCategories from '@/components/section/product/AddCategories.vue';

export default {
  components: { AddCategories },
  props: {
    selectedCategories: {
      type: Array,
      default: () => [],
    },
    categoryUrl: {
      type: String,
      default: '/api/product/seller-panel/category-product-list-create/',
    },
    pinProfile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:selectedCategories', 'update:pinProfile'],
};
</script>

<style scoped>
.panel-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f9fffb 0%, #f2fff7 100%);
  border: 1px solid #d7f5e5;
  box-shadow: 0 12px 30px rgba(16, 146, 76, 0.06);
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #bde9d0;
  margin-bottom: 12px;
}

.heading-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #2e7d32, #43a047);
  box-shadow: 0 0 0 6px rgba(46, 125, 50, 0.12);
}
</style>
