<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">توضیحات و آموزش</h4>
      </div>

      <div class="rtl-block">
        <p class="pb-1 text-caption text-grey-darken-1">توضیحات محصول</p>
        <TextEditor :content="description" @update="$emit('update:description', $event)" />

        <v-checkbox
          class="mt-5"
          color="primary"
          :model-value="isContainTutorial"
          @update:modelValue="toggleTutorial"
          label="افزودن آموزش و نکات استفاده از محصول"
        />

        <v-slide-y-transition>
          <div v-if="isContainTutorial" class="rtl-block">
            <p class="pb-1 text-caption text-grey-darken-1">آموزش و نکات استفاده از محصول</p>
            <TextEditor :content="instructions" @update="$emit('update:instructions', $event)" />
            <v-alert
              class="mt-3 mb-1 rounded-lg soft-hint note-block"
              border="start"
              elevation="0"
              variant="tonal"
            >
              <template #title>نکته</template>
              <div class="note-text">
                توضیحاتی که در کادر بالا قرار می‌دهید پس از خرید در کنار محصول خریداری شده به خریدار
                نمایش داده می‌شود؛ این توضیحات می‌تواند شامل آموزش استفاده از محصول یا نکات مهم استفاده
                از محصول باشد.
              </div>
            </v-alert>
          </div>
        </v-slide-y-transition>
      </div>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: '',
    },
    instructions: {
      type: String,
      default: '',
    },
    isContainTutorial: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:description', 'update:instructions', 'update:isContainTutorial'],
  methods: {
    toggleTutorial(value) {
      this.$emit('update:isContainTutorial', value);
      if (!value) {
        this.$emit('update:instructions', '');
      }
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
  background: linear-gradient(135deg, #f6f9ff 0%, #f2f6ff 100%);
  border: 1px solid #e6ecff;
  box-shadow: 0 12px 30px rgba(40, 72, 133, 0.06);
  text-align: right;
}

.panel-heading {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #d8def3;
  margin-bottom: 12px;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
}

.heading-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #1976d2, #42a5f5);
  box-shadow: 0 0 0 6px rgba(25, 118, 210, 0.08);
}

.soft-hint {
  background: #f8fafc;
  border: 1px dashed #d7e3ff;
}

.rtl-block {
  direction: rtl;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-block {
  direction: rtl;
  text-align: right;
  line-height: 1.8;
  white-space: normal;
  padding: 14px 16px;
  margin-top: 12px;
  margin-bottom: 4px;
  overflow: visible;
}

.note-text {
  direction: rtl;
  text-align: right;
  line-height: 1.9;
  white-space: normal;
  word-break: break-word;
}
</style>
