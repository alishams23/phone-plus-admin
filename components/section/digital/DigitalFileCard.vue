<template>
  <v-sheet class="panel-card" elevation="10">
    <v-locale-provider rtl>
      <div class="panel-heading">
        <div class="heading-dot"></div>
        <h4 class="text-h6 font-weight-bold">مدیریت محتوای دیجیتال</h4>
      </div>

      <v-select
        v-if="!id"
        rounded="lg"
        required
        accept=".zip,.rar"
        persistent-hint
        variant="outlined"
        color="primary"
        :model-value="fileType"
        @update:modelValue="$emit('update:fileType', $event)"
        :label="'انتخاب نوع محصول'"
        :items="fileTypeOptions"
        :rules="comboboxRules"
        class="mb-3"
      />

      <div v-if="showFileInputs" class="file-chooser">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-caption text-grey-darken-1">روش ارائه فایل</span>
          <v-checkbox
            density="comfortable"
            :model-value="isContainFile"
            @update:modelValue="$emit('update:isContainFile', $event)"
            color="primary"
            label="آپلود فایل"
            class="ma-0"
          />
        </div>

        <v-slide-y-transition>
          <div v-if="isContainFile">
            <v-file-input
              rounded="lg"
              accept=".zip,.rar,.pdf"
              persistent-hint
              variant="outlined"
              color="primary"
              :loading="loadingFile"
              :required="fileRequired"
              placeholder="اضافه کردن فایل"
              @change="$emit('file-selected', $event)"
              :label="fileUploadLabel"
            >
              <template #selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip size="small" label color="primary">
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>
          </div>
        </v-slide-y-transition>

        <div v-if="!isContainFile">
          <v-text-field
            rounded="lg"
            :required="fileRequired"
            persistent-hint
            variant="outlined"
            color="primary"
            :label="fileLinkLabel"
            :model-value="fileUrl"
            @update:modelValue="$emit('update:fileUrl', $event)"
            placeholder="لینک دانلود فایل"
          />
        </div>
      </div>

      <p v-if="fileError" class="d-flex justify-start w-100 ps-4 text-red-darken-3">
        {{ fileError }}
      </p>

      <div class="current-links" v-if="getFile || getFileUrl">
        <a v-if="getFile" :href="getFile" class="chip-link">
          دانلود فایل فعلی
        </a>
        <a v-if="getFileUrl" :href="getFileUrl" class="chip-link">
          لینک فایل فعلی
        </a>
      </div>

      <v-row
        class="mt-1 mb-5 rtl license-row"
        align="end"
        v-if="showSingleLicense"
      >
        <v-col cols="12" md="6">
          <v-text-field
            label="عنوان ستون"
            :required="licenseRequired"
            rounded="lg"
            persistent-hint
            variant="outlined"
            color="primary"
            :model-value="columnTitle"
            @update:modelValue="$emit('update:columnTitle', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="مقدار ستون"
            :required="licenseRequired"
            rounded="lg"
            persistent-hint
            variant="outlined"
            color="primary"
            :model-value="columnBody"
            @update:modelValue="$emit('update:columnBody', $event)"
          />
        </v-col>
        <v-col cols="12" v-if="currentRowColumns.length">
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="(col, idx) in currentRowColumns"
              :key="idx"
              color="indigo-lighten-1"
              class="ma-1"
            >
              <span class="font-weight-bold ms-1">{{ col.title }}:</span> {{ col.body }}
            </v-chip>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            type="button"
            class="rounded-lg mt-2 mb-5 w-100"
            color="primary"
            :disabled="!columnTitle && !columnBody"
            @click="$emit('add-column')"
            variant="tonal"
          >
            افزودن ستون
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            type="button"
            :disabled="disableAddRow"
            class="rounded-lg mt-2 mb-5 w-100"
            color="primary"
            @click="$emit('add-row')"
            variant="flat"
          >
            ثبت ردیف
            <template #append>
              <CheckIcon size="17" />
            </template>
          </v-btn>
        </v-col>
        
      </v-row>

      <v-alert
        v-if="showBulkLicense"
        class="mt-2 mb-5 rounded-lg soft-hint note-block"
        border="start"
        elevation="0"
        variant="tonal"
      >
        <template #title>نکته</template>
        <div class="note-text">
          برای ثبت لایسنس‌های خود، لطفاً فایل اکسل را با دقت تکمیل کنید و در نظر داشته باشید اولین ردیف را
          به عنوان تخصیص دهید. هر ردیف فایل باید حاوی اطلاعات یک لایسنس باشد. پس از تکمیل، فایل خود را در بخش مربوطه
          در وب‌سایت آپلود کنید تا لایسنس‌های شما به سرعت و به طور موثر ثبت شوند.
        </div>
      </v-alert>

      <v-file-input
        v-if="showBulkLicense"
        :key="fileInputKey"
        :required="licenseRequired"
        rounded="lg"
        accept=".xlsx"
        persistent-hint
        variant="outlined"
        color="primary"
        @change="$emit('csv-upload', $event)"
        placeholder="اضافه لیست"
        :label="csvLabel"
        class="mb-1"
      >
        <template #selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip size="small" label color="primary">
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>

      <div v-if="transformedData.length" class="cards-block">
        <div class="d-flex items-center">
          <p class="pt-5 pb-2">ردیف های اضافه شده:</p>
          <p class="pt-5 pb-2 mx-3 text-sm-body-2 text-red cursor-pointer" @click="$emit('clear-csv')">
            پاک کردن همه
          </p>
        </div>
        <div class="d-flex justify-end w-100 table-scroller">
          <v-table fixed-header class="w-100 panel-table">
            <tbody class="scrollable-tbody horizontal-scroll" >
              <tr
                v-for="(items, rowIndex) in transformedData"
                :key="rowIndex"
                class="table-row"
              >
              <SharedConfirmationDialog @delete-item="$emit('remove-row', rowIndex)">
                <v-btn class="mb-2 me-2 ms-1" icon color="red" variant="tonal" size="small">
                  <TrashIcon size="18" />
                </v-btn>
              </SharedConfirmationDialog>
                <td class="table-cell rtl" v-for="(item, i) in items" :key="i">
                  <div class="cell-badge">
                    <span class="font-weight-bold">{{ item.title }}:</span>
                    {{ item.body }}
                  </div>
                </td>
                <td class="table-cell">
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>

      <div v-if="showExistingSubset" class="cards-block">
        <div class="d-flex items-center">
          <p class="pt-5 pb-2">
            ردیف های موجود از قبل:
            <span> ({{ subsetProduct.filter(item => item.sold === false).length }})</span>
          </p>
        </div>
        <div class="d-flex justify-end w-100 table-scroller">
          <v-table fixed-header class="w-100 panel-table">
            <tbody class="scrollable-tbody horizontal-scroll" dir="rtl">
              <tr
                v-for="(items, idx) in subsetProduct"
                :key="idx"
                class="table-row"
              >
                <template v-if="items.sold === false">
                  <SharedConfirmationDialog @delete-item="$emit('remove-subset', items)">
                    <v-btn class="mb-2 me-2 ms-1" icon color="red" variant="tonal" size="small">
                      <TrashIcon size="18" />
                    </v-btn>
                  </SharedConfirmationDialog>
                  <td class="table-cell pt-2 rtl" v-for="(item, i) in items.data" :key="i">
                    <div class="cell-badge existing">
                      <span class="font-weight-bold">{{ item.title }}:</span>
                      {{ item.body }}
                    </div>
                  </td>

                </template>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    </v-locale-provider>
  </v-sheet>
</template>

<script>
import SharedConfirmationDialog from '@/components/shared/ConfirmationDialog.vue';
import { CheckIcon, TrashIcon } from 'vue-tabler-icons';

export default {
  components: { SharedConfirmationDialog, CheckIcon, TrashIcon },
  props: {
    id: {
      type: [String, Number, null],
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },
    comboboxRules: {
      type: Array,
      default: () => [],
    },
    showFileInputs: {
      type: Boolean,
      default: false,
    },
    isContainFile: {
      type: Boolean,
      default: false,
    },
    fileRequired: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileUploadLabel: {
      type: String,
      default: 'فایل محصول',
    },
    fileLinkLabel: {
      type: String,
      default: 'لینک فایل محصول',
    },
    fileError: {
      type: String,
      default: null,
    },
    fileInputKey: {
      type: [String, Number],
      default: () => Date.now(),
    },
    loadingFile: {
      type: Boolean,
      default: false,
    },
    showSingleLicense: {
      type: Boolean,
      default: false,
    },
    showBulkLicense: {
      type: Boolean,
      default: false,
    },
    licenseRequired: {
      type: Boolean,
      default: false,
    },
    columnTitle: {
      type: String,
      default: '',
    },
    columnBody: {
      type: String,
      default: '',
    },
    currentRowColumns: {
      type: Array,
      default: () => [],
    },
    disableAddRow: {
      type: Boolean,
      default: false,
    },
    transformedData: {
      type: Array,
      default: () => [],
    },
    subsetProduct: {
      type: Array,
      default: () => [],
    },
    showExistingSubset: {
      type: Boolean,
      default: false,
    },
    getFile: {
      type: String,
      default: null,
    },
    getFileUrl: {
      type: String,
      default: null,
    },
    csvLabel: {
      type: String,
      default: 'لیست محصول',
    },
  },
  emits: [
    'update:fileType',
    'update:isContainFile',
    'update:fileUrl',
    'update:licenseBody',
    'file-selected',
    'csv-upload',
    'clear-csv',
    'add-row',
    'remove-row',
    'remove-subset',
  ],
  computed: {
    fileTypeOptions() {
      return [
        'افزودن گروهی: اکانت، لایسنس یا کد یکتا',
        'افزودن تکی: اکانت، لایسنس یا کد یکتا',
        'فایل',
      ];
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
  background: linear-gradient(135deg, #f7f9fd 0%, #eef2fb 100%);
  border: 1px solid #dfe5f7;
  box-shadow: 0 12px 30px rgba(34, 52, 108, 0.08);
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
  background: linear-gradient(180deg, #3949ab, #5c6bc0);
  box-shadow: 0 0 0 6px rgba(92, 107, 192, 0.12);
}

.file-chooser {
  border: 1px dashed #d4dbf5;
  border-radius: 14px;
  padding: 12px;
  background: #f8faff;
}

.current-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0 14px;
}

.chip-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  background: #eef1ff;
  color: #283593;
  text-decoration: none;
  font-size: 0.85rem;
  border: 1px solid #dfe5ff;
}

.scrollable-tbody {
  display: block;
  max-height: 250px;
  overflow-x: auto;
  overflow-y: auto;
  direction: ltr !important;
  background: #fff;
  border-radius: 12px;
  width: 100%;
}

.table-cell {
  width: auto;
  min-width: auto;
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
}

.panel-table {
  border-radius: 14px;
  background: transparent;
  display: block;
  width: 100%;
  overflow-x: auto;
}

.panel-table :deep(table) {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  table-layout: fixed;
  border-spacing: 0 6px;
}

.table-scroller {
  overflow-x: auto;
}

.horizontal-scroll {
  display: block;
}

.table-row {
  display: table-row;
}

.cell-badge {
  background: #eef3ff;
  color: #1f2d5c;
  border-radius: 12px;
  padding: 10px 14px;
  text-align: center;
  border: 1px solid #dce3ff;
}

.cell-badge.existing {
  background: #e8edff;
  border-color: #c8d2ff;
  color: #303f9f;
}

.soft-hint {
  background: #f8fafc;
  border: 1px dashed #d7e3ff;
}

.cards-block {
  margin-top: 8px;
  padding: 10px 8px;
  border-radius: 12px;
  border: 1px solid #e2e7fa;
  background: #fdfefe;
}

.license-row {
  align-items: flex-end;
}

.license-row .v-btn {
  width: 100%;
  margin-inline: 0;
  justify-content: center;
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
