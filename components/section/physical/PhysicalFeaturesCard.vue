<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">ویژگی‌های محصول</h4>
      </div>
      <AddSpecification :data="specs" @change="$emit('update:specs', $event)" />
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import AddSpecification from '@/components/section/product/AddSpecification.vue';

export default {
  components: { AddSpecification },
  props: {
    specs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:specs'],
};
</script>

<style scoped>
.panel-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  box-shadow: 0 10px 22px rgba(34, 60, 114, 0.06);
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #d8def3;
  margin-bottom: 12px;
}

.heading-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #3f51b5, #5c6bc0);
  box-shadow: 0 0 0 6px rgba(63, 81, 181, 0.08);
}
</style>
