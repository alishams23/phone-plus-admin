<template>
  <v-btn
    rounded="pill"
    icon
    variant="outline"
    color="primary"
    :disabled="loadingImage"
    class="text-body2 hidden-sm-and-down font-weight-bold fixed-top-left"
    @click="$emit('cancel')"
  >
    <XIcon size="24" />
  </v-btn>
  <v-btn
    rounded="pill"
    icon
    variant="outline"
    color="primary"
    :disabled="loadingImage"
    class="text-body2 font-weight-bold hidden-md-and-up fixed-top-left"
    @click="$emit('cancel')"
  >
    <XIcon size="24" />
  </v-btn>

  <v-container>
    <v-snackbar :timeout="2000" color="red" variant="flat" elevation="24" v-model="snackbar_delete">
      <div class="w-100 rtl">
        <p>با موفقیت حذف شد</p>
      </div>
      <template #actions>
        <v-btn color="red" variant="text" @click="snackbar_delete = false">
          <XIcon />
        </v-btn>
      </template>
    </v-snackbar>

    <form @submit.prevent="sendData">
      <v-overlay :model-value="loadingData" :z-index="5">
        <v-progress-circular
          bg-color="transparent"
          :size="55"
          class="ma-10"
          :width="5"
          color="primary"
          indeterminate
        />
      </v-overlay>

      <div class="form-content form-shell" :class="{ blurred: loadingData }">
        <DigitalImagePicker
          :title="title"
          :images="images"
          :image-ids="imageIds"
          :address="address"
          :loading-image="loadingImage"
          :rules="rules"
          @update:title="title = $event"
          @update:images="images = $event"
          @upload="sendImage"
          @remove-image="removeImage"
        />

        <DigitalDescriptionCard
          :description="description"
          :instructions="instructions"
          :is-contain-tutorial="isContainTutorial"
          @update:description="description = $event"
          @update:instructions="instructions = $event"
          @update:isContainTutorial="isContainTutorial = $event"
        />

        <DigitalPricingCard
          :price="price"
          :price-label="priceLabel"
          :discount-enabled="discount"
          :discount-value="value"
          :discount-codes="discount_codes"
          @update:price="price = $event"
          @update:discountEnabled="handleDiscountToggle"
          @update:discountValue="value = $event"
          @update:discountCodes="discount_codes = $event"
        />

        <DigitalFileCard
          :id="id"
          :file-type="file_type"
          :combobox-rules="comboboxRules"
          :show-file-inputs="isFileProduct"
          :is-contain-file="isContainFile"
          :file-required="fileRequired"
          :file-url="file_url"
          :file-upload-label="fileUploadLabel"
          :file-link-label="fileLinkLabel"
          :file-error="file_error"
          :file-input-key="fileInputKey"
          :loading-file="loadingFile"
          :show-single-license="showSingleLicense"
          :show-bulk-license="showBulkLicense"
          :license-required="licenseRequired"
          :column-title="columnTitle"
          :column-body="columnBody"
          :current-row-columns="currentRowColumns"
          :disable-add-row="disableAddRow"
          :transformed-data="transformedData"
          :subset-product="subset_product"
          :show-existing-subset="showExistingSubset"
          :get-file="get_file"
          :get-file-url="normalizedFileUrl"
          :csv-label="csvLabel"
          @update:fileType="handleFileTypeChange"
          @update:isContainFile="toggleContainFile"
          @update:fileUrl="file_url = $event"
          @update:columnTitle="columnTitle = $event"
          @update:columnBody="columnBody = $event"
          @file-selected="handleFileChange"
          @csv-upload="handleCsvUpload"
          @clear-csv="clearData"
          @add-column="addColumn"
          @add-row="addRow"
          @remove-row="removeCsvRow"
          @remove-subset="removeSubsetItem"
          @update-transformed-cell="updateTransformedCell"
          @update-existing-subset="updateExistingSubsetCell"
        />

        <DigitalMetaCard
          :selected-categories="selectedCategories"
          :pin-profile="pin_profile"
          @update:selectedCategories="selectedCategories = $event"
          @update:pinProfile="pin_profile = $event"
        />

        <div class="d-flex actions-bar">
          <v-btn
            rounded="lg"
            persistent-hint
            variant="flat"
            color="primary"
            :disabled="loadingImage || loadingFile || disabled_submit"
            class="mx-2 px-10 text-body2 font-weight-bold mb-5"
            type="submit"
          >
            ثبت
          </v-btn>
        </div>
      </div>
    </form>
  </v-container>
</template>

<script>
import Papa from 'papaparse';
import { XIcon } from 'vue-tabler-icons';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import * as XLSX from 'xlsx';
import DigitalImagePicker from '@/components/section/digital/DigitalImagePicker.vue';
import DigitalDescriptionCard from '@/components/section/digital/DigitalDescriptionCard.vue';
import DigitalPricingCard from '@/components/section/digital/DigitalPricingCard.vue';
import DigitalFileCard from '@/components/section/digital/DigitalFileCard.vue';
import DigitalMetaCard from '@/components/section/digital/DigitalMetaCard.vue';

export default {
  components: {
    XIcon,
    DigitalImagePicker,
    DigitalDescriptionCard,
    DigitalPricingCard,
    DigitalFileCard,
    DigitalMetaCard,
  },
  emits: ['close', 'cancel'],
  props: ['id'],
  data: () => ({
    snackbar_delete: false,
    price: 0,
    fileInputKey: Date.now(),
    title: '',
    instructions: '',
    csvData: [],
    transformedData: [],
    description: '',
    isContainTutorial: false,
    isContainFile: false,
    images: [],
    imageIds: [],
    loadingFile: false,
    loadingImage: false,
    loadingData: false,
    disabled_submit: false,
    selectedCategories: [],
    file_type: null,
    file_error: null,
    discount_codes: [],
    subset_product: [],
    discount: false,
    pin_profile: false,
    video: '',
    get_file: null,
    get_file_url: null,
    file: null,
    type: null,
    file_url: '',
    value: 0,
        body: '',
        columnTitle: '',
        columnBody: '',
        currentRowColumns: [],
    maxFileSize: 30 * 1024 * 1024,
    rules: [
      files =>
        !files ||
        !files.some(file => file.size > 2_097_152) ||
        'حجم تصویر باید کمتر از 2MB باشد',
    ],
    comboboxRules: [(v) => !!v || 'نوع محصول را انتخاب کنید'],
  }),
  computed: {
    address() {
      return apiStore().address;
    },
    userToken() {
      return useUserStore().userToken;
    },
    priceLabel() {
      const isLicenseChoice =
        this.file_type === 'افزودن گروهی: اکانت، لایسنس یا کد یکتا' ||
        this.file_type === 'افزودن تکی: اکانت، لایسنس یا کد یکتا' ||
        this.type === 'license';
      return isLicenseChoice ? 'قیمت هر ردیف (تومان)' : 'قیمت (تومان)';
    },
    isFileProduct() {
      const hasExistingFile =
        !!this.get_file || (!!this.get_file_url && this.get_file_url !== 'null');
      if (this.id != null) {
        if (this.type === 'file') return true;
        if (this.type === 'license') return false;
        return hasExistingFile;
      }
      return this.file_type === 'فایل';
    },
    showSingleLicense() {
      const isEditingLicense =
        this.id != null &&
        ((this.get_file == null && (this.get_file_url === 'null' || !this.get_file_url) && this.type == null) ||
          this.type === 'license');
      const isNewSingle = this.file_type === 'افزودن تکی: اکانت، لایسنس یا کد یکتا';
      return isEditingLicense || isNewSingle;
    },
    showBulkLicense() {
      const isEditingLicense =
        this.id != null &&
        ((this.get_file == null && (this.get_file_url === 'null' || !this.get_file_url) && this.type == null) ||
          this.type === 'license');
      const isNewBulk = this.file_type === 'افزودن گروهی: اکانت، لایسنس یا کد یکتا';
      return isEditingLicense || isNewBulk;
    },
    showExistingSubset() {
      return this.subset_product.length > 0 && this.subset_product.some(item => !item.sold);
    },
    fileUploadLabel() {
      return this.id ? 'تعویض فایل محصول' : 'فایل محصول';
    },
    fileLinkLabel() {
      return this.id ? 'تعویض لینک فایل محصول' : 'لینک فایل محصول';
    },
    csvLabel() {
      return this.id ? 'اضافه کردن به لیست محصول' : 'لیست محصول';
    },
    normalizedFileUrl() {
      if (this.get_file_url !== null && this.get_file_url !== 'null') {
        return this.get_file_url;
      }
      return null;
    },
    fileRequired() {
      return this.fileRequiredHandler();
    },
    licenseRequired() {
      return this.LicenseRequiredHandler();
    },
    disableAddRow() {
      return this.currentRowColumns.length === 0;
    },
  },
  mounted() {
    if (this.id != null) {
      this.getData();
    }
  },
  methods: {
    clearData() {
      this.transformedData = [];
      this.fileInputKey = Date.now();
    },
    addRow() {
      if (!Array.isArray(this.transformedData)) {
        this.transformedData = [];
      }
      if (this.currentRowColumns.length === 0) return;
      this.transformedData.push([...this.currentRowColumns]);
      this.currentRowColumns = [];
    },
    addColumn() {
      const colTitle =
        this.columnTitle && this.columnTitle.trim().length ? this.columnTitle.trim() : 'ستون';
      const colBody = this.columnBody && this.columnBody.trim().length ? this.columnBody.trim() : '';
      this.currentRowColumns.push({ title: colTitle, body: colBody });
      this.columnTitle = '';
      this.columnBody = '';
    },
    addColumn() {
      const colTitle =
        this.columnTitle && this.columnTitle.trim().length ? this.columnTitle.trim() : 'ستون';
      const colBody = this.columnBody && this.columnBody.trim().length ? this.columnBody.trim() : '';
      this.currentRowColumns.push({ title: colTitle, body: colBody });
      this.columnTitle = '';
      this.columnBody = '';
    },
    updateTransformedCell({ rowIndex, cellIndex, value }) {
      if (!Array.isArray(this.transformedData)) return;
      const targetRow = this.transformedData[rowIndex];
      if (!targetRow || !targetRow[cellIndex]) return;
      const sanitizedValue = value != null ? String(value).trim() : '';
      const updatedRow = targetRow.map((cell, idx) =>
        idx === cellIndex ? { ...cell, body: sanitizedValue } : cell,
      );
      this.transformedData.splice(rowIndex, 1, updatedRow);
    },
    async updateExistingSubsetCell({ rowId, cellId, rowIndex, cellIndex, title, body }) {
      const payload = {
        title: title != null ? String(title).trim() : '',
        body: body != null ? String(body).trim() : '',
      };
      try {
        await axios.patch(
          `${apiStore().address}/api/product/seller-panel/row-subset-digital-product/${rowId}/data-row/${cellId}/`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Token ${this.userToken}`,
            },
          },
        );
        const targetRow = this.subset_product[rowIndex];
        if (targetRow && Array.isArray(targetRow.data) && targetRow.data[cellIndex]) {
          const updatedCell = { ...targetRow.data[cellIndex], ...payload };
          this.subset_product[rowIndex].data.splice(cellIndex, 1, updatedCell);
        }
      } catch (error) {
        console.error('Error updating subset row:', error);
      }
    },
    handleCsvUpload(event) {
      if (!event?.target?.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileType = file.name.split('.').pop();
      if (fileType === 'csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          Papa.parse(content, {
            complete: (results) => {
              this.csvData = results.data;
              this.transformedData = this.transformCSVData(results.data);
            },
            header: true,
          });
        };
        reader.readAsText(file);
      } else if (fileType === 'xlsx') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.csvData = json;
          this.transformedData = this.transformXLSXData(json).filter(row => row.length > 0);
        };
        reader.readAsArrayBuffer(file);
      }
    },
    fileRequiredHandler() {
      if (this.id != null) {
        return false;
      }
      if (this.file_type === 'فایل') {
        if (this.isContainFile) {
          return this.file == null;
        }
        return this.file_url == null;
      }
      return false;
    },
    LicenseRequiredHandler() {
      if (this.id != null) {
        return false;
      }
      if (
        this.file_type === 'افزودن گروهی: اکانت، لایسنس یا کد یکتا' ||
        this.file_type === 'افزودن تکی: اکانت، لایسنس یا کد یکتا'
      ) {
        return this.transformedData.length === 0;
      }
      return false;
    },
    handleInputChange() {
      this.file_url = '';
      this.file = null;
      this.transformedData = [];
    },
    transformXLSXData(data) {
      if (data.length === 0) return [];
      const headers = data[0];
      return data.slice(1).map(row =>
        headers
          .map((header, index) => {
            const cell = row[index];
            if (cell !== undefined && cell !== null && cell !== '' && cell !== ' ') {
              return { title: header, body: cell };
            }
            return null;
          })
          .filter(cell => cell !== null),
      );
    },
    transformCSVData(data) {
      const transformedData = data.map(row =>
        Object.keys(row)
          .map(key => {
            if (row[key] !== '' && row[key] !== null && row[key] !== undefined) {
              return { title: key, body: row[key] };
            }
            return null;
          })
          .filter(item => item !== null),
      );
      return transformedData.filter(row => row.length > 0);
    },
    async removeSubsetProduct(item) {
      await fetch(
        `${apiStore().address}/api/product/seller-panel/remove-row-subset-digital-product/${item.id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Token ${this.userToken}`,
          },
        },
      ).catch(error => {
        console.error('Error removing product:', error);
      });
    },
    handleFileChange(event) {
      const files = event?.target?.files || event;
      if (files && files[0]) {
        const fileSize = files[0].size;
        if (fileSize > this.maxFileSize) {
          this.file_error = `حجم فایل باید کمتر از  ${this.maxFileSize / 1024 / 1024}MB باشد`;
          this.file = null;
        } else {
          this.file = files;
          this.file_error = null;
        }
      }
    },
    async sendDataFunc() {
      if (this.images && this.images.length) {
        this.images.forEach((file) => {
          const imageFormData = new FormData();
          imageFormData.append('photo', file);
          axios
            .post(`${apiStore().address}/api/product/seller-panel/add-image/`, imageFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${useUserStore().userToken}`,
              },
            })
            .then((data) => {
              this.imageIds.push(data.data.id);
              this.loadingImage = false;
            })
            .catch((error) => {
              console.error('Error uploading images:', error);
            });
        });
      }
    },
    async sendImage() {
      this.loadingImage = true;
      this.sendDataFunc();
    },
    async sendData() {
      const formData = new FormData();
      const discount_codes_id = [];
      this.disabled_submit = true;

      if (this.file != null) {
        this.loadingFile = true;
        formData.append('file', this.file[0]);
      }
      this.discount_codes.forEach((element) => {
        discount_codes_id.push(element.id);
      });
      if (discount_codes_id.length > 0) {
        formData.append('discount_codes', discount_codes_id);
      }
      formData.append('title', this.title);
      formData.append('price', this.price);
      formData.append('description', this.description);
      formData.append('instructions', this.instructions);
      formData.append('discount', this.value);
      formData.append('link_file', this.file_url || '');
      formData.append('pin_profile', this.pin_profile);
      formData.append('subsets_data', JSON.stringify(this.transformedData));
      this.imageIds.forEach((element) => {
        formData.append('image', element);
      });
      this.selectedCategories.forEach((element) => {
        formData.append('category', element);
      });

      const header = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${useUserStore().userToken}`,
        },
      };

      const url =
        this.id != null
          ? `/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/`
          : '/api/product/seller-panel/digital-product-list-create/';
      try {
        if (this.id != null) {
          await axios.patch(`${apiStore().address}${url}`, formData, header);
        } else {
          await axios.post(`${apiStore().address}${url}`, formData, header);
        }
        this.$emit('close');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.disabled_submit = false;
        this.loadingFile = false;
      }
    },
    getData() {
      this.loadingData = true;
      axios
        .get(
          `${apiStore().address}/api/product/seller-panel/digital-product-retrieve-update-destroy/${this.id}/`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Token ${useUserStore().userToken}`,
            },
          },
        )
        .then((response) => {
          this.loadingData = false;
          this.description = response.data.description && response.data.description !== 'null'
            ? response.data.description
            : '';
          this.instructions = response.data.instructions && response.data.instructions !== 'null'
            ? response.data.instructions
            : '';
          this.title = response.data.title;
          this.video = response.data.video;
          this.pin_profile = response.data.pin_profile;
          response.data.image.forEach((element) => {
            this.imageIds.push(element.id);
          });
          response.data.category.forEach((element) => {
            this.selectedCategories.push(element.id);
          });
          this.price = response.data.price;
          this.value = response.data.discount;
          this.type = response.data.type;
          this.get_file = response.data.file;
          this.get_file_url = response.data.link_file && response.data.link_file !== 'null'
            ? response.data.link_file
            : null;
          this.file_url = this.get_file_url || '';
          this.subset_product = response.data.subset_product;
          this.discount_codes = response.data.discount_codes != null ? response.data.discount_codes : [];
          if (response.data.discount) this.discount = true;
          const hasInstructionContent =
            !!this.instructions &&
            this.instructions !== 'null' &&
            this.instructions !== '<p class="ql-align-right ql-direction-rtl"><br></p>';
          this.isContainTutorial = hasInstructionContent;
        });
    },
    removeImage(id) {
      const index = this.imageIds.indexOf(id);
      if (index > -1) {
        this.imageIds.splice(index, 1);
      }
    },
    handleDiscountToggle(value) {
      this.discount = value;
      if (!value) {
        this.value = 0;
      }
    },
    toggleContainFile(value) {
      this.isContainFile = value;
      this.file_url = '';
      this.file = null;
      this.currentRowColumns = [];
      this.columnTitle = '';
      this.columnBody = '';
    },
    handleFileTypeChange(value) {
      this.file_type = value;
      this.isContainFile = false;
      this.handleInputChange();
    },
    removeCsvRow(index) {
      this.transformedData.splice(index, 1);
      this.snackbar_delete = true;
    },
    async removeSubsetItem(item) {
      this.subset_product.splice(this.subset_product.indexOf(item), 1);
      this.snackbar_delete = true;
      await this.removeSubsetProduct(item);
    },
  },
};
</script>

<style>
.blurred {
  filter: blur(4px);
  pointer-events: none;
}

.form-content {
  display: grid;
  gap: 16px;
  padding: 4px;
}

@media (min-width: 960px) {
  .form-content {
    gap: 20px;
    padding: 8px 4px;
  }
}

.form-shell {
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
}

.form-shell > * {
  width: 100%;
}

.form-shell > * + * {
  margin-top: 6px;
}

.actions-bar {
  direction: ltr;
  justify-content: flex-start;
  padding-inline: 4px;
}

.scrollable-tbody {
  display: block;
  max-height: 250px;
  overflow-x: auto;
  overflow-y: scroll;
  direction: ltr !important;
}

.table-cell {
  min-width: 120px;
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
}

.fixed-top-left {
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1000;
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
