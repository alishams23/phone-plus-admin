<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">نام و تصاویر</h4>
      </div>

      <v-text-field
        label="نام محصول"
        :model-value="title"
        @update:modelValue="$emit('update:title', $event)"
        :maxlength="80"
        rounded="lg"
        required
        persistent-hint
        variant="outlined"
        color="primary"
        class="mt-md-2 mb-4 rtl-field"
      />

      <v-text-field
        label="کد آی‌فریم ویدیو محصول"
        :model-value="video"
        @update:modelValue="$emit('update:video', $event)"
        rounded="lg"
        variant="outlined"
        color="primary"
        class="mb-4 rtl-field"
      />

      <v-file-input
        :loading="loadingImage"
        :disabled="loadingImage"
        rounded="lg"
        accept=".png,.jpg"
        :rules="rules"
        :model-value="images"
        multiple
        required
        persistent-hint
        variant="outlined"
        prepend-icon=""
        color="primary"
        @update:modelValue="$emit('update:images', $event)"
        @change="$emit('upload')"
        placeholder="تصاویر محصول"
        label="عکس‌های محصول"
        class="mb-3 rtl-field"
      >
        <template #prepend>
          <PhotoIcon class="text-grey" />
        </template>
        <template #selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary" class="ma-1">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>

      <div v-if="imageIds.length" class="image-preview-container mt-4">
        <div v-for="preview in imageIds" :key="preview" class="preview-tile">
          <v-img
            :src="`${address}/api/product/product-image/${preview}/ `"
            class="chip-image-preview object-cover"
          >
            <v-avatar
              size="30"
              class="ma-3"
              @click="$emit('remove-image', preview)"
              color="red-darken-2"
            >
              <TrashIcon size="15" />
            </v-avatar>
          </v-img>
        </div>
      </div>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import { PhotoIcon, TrashIcon } from 'vue-tabler-icons';

export default {
  components: { PhotoIcon, TrashIcon },
  props: {
    title: {
      type: String,
      default: '',
    },
    video: {
      type: String,
      default: '',
    },
    images: {
      type: Array,
      default: () => [],
    },
    imageIds: {
      type: Array,
      default: () => [],
    },
    address: {
      type: String,
      default: '',
    },
    loadingImage: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:title', 'update:video', 'update:images', 'upload', 'remove-image'],
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
  text-align: right;
}

.panel-heading {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #cfd7f2;
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
  box-shadow: 0 0 0 6px rgba(63, 81, 181, 0.08);
}

.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-top: 12px;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  border-radius: 12px;
  padding: 10px;
}

.preview-tile {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e9f4;
  background: #fff;
  box-shadow: 0 6px 14px rgba(27, 48, 101, 0.05);
}

.chip-image-preview {
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e7f4;
}

.rtl-field :deep(.v-field__input),
.rtl-field :deep(.v-label) {
  text-align: right !important;
}
</style>
