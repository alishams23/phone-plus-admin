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

  <form @submit.prevent="sendData">
    <v-overlay :value="loadingData" :z-index="5">
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
      
      <PhysicalImagePicker
        :title="title"
        :video="video"
        :images="images"
        :image-ids="imageIds"
        :address="address"
        :loading-image="loadingImage"
        :rules="rules"
        @update:title="title = $event"
        @update:video="video = $event"
        @update:images="images = $event"
        @upload="sendImage"
        @remove-image="removeImage"
      />

      <PhysicalDescriptionCard
        :description="description"
        @update:description="description = $event"
      />

      <PhysicalFeaturesCard
        :specs="list_specification"
        @update:specs="(data) => { list_specification = data }"
      />

      <PhysicalPricingCard
        :colors="list_color"
        :discount-codes="discount_codes"
        :value="value"
        :delivery-fee="delivery_fee"
        :delivery-rules="[validateDeliveryFee]"
        :error="error"
        @update:colors="(data) => { list_color = data }"
        @update:discountCodes="(data) => { discount_codes = data }"
        @update:value="(data) => { value = data }"
        @update:deliveryFee="delivery_fee = $event"
        @removeColor="(color) => { list_color = list_color.filter(c => c !== color) }"
      />

      <PhysicalMetaCard
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
          :disabled="loadingImage"
          class="mx-2 px-10 text-body2 font-weight-bold mb-5"
          type="submit"
        >
          ثبت
        </v-btn>
      </div>
    </div>
  </form>
</template>

<script>
import { XIcon } from 'vue-tabler-icons';
import AddCategories from '@/components/section/product/AddCategories.vue';
import AddColor from '@/components/section/product/AddColor.vue';
import AddDiscountcodes from '@/components/section/product/AddDiscountcodes.vue';
import AddSpecification from '@/components/section/product/AddSpecification.vue';
import AddDiscount from '@/components/section/product/AddDiscount.vue';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';
import PhysicalImagePicker from '@/components/section/physical/PhysicalImagePicker.vue';
import PhysicalDescriptionCard from '@/components/section/physical/PhysicalDescriptionCard.vue';
import PhysicalPricingCard from '@/components/section/physical/PhysicalPricingCard.vue';
import PhysicalMetaCard from '@/components/section/physical/PhysicalMetaCard.vue';
import PhysicalFeaturesCard from '@/components/section/physical/PhysicalFeaturesCard.vue';

export default {
  components: {
    XIcon,
    AddCategories,
    AddColor,
    AddDiscountcodes,
    AddSpecification,
    AddDiscount,
    PhysicalImagePicker,
    PhysicalDescriptionCard,
    PhysicalPricingCard,
    PhysicalMetaCard,
    PhysicalFeaturesCard,
  },
  props: ['id'],
  emits: ['close', 'cancel'],
  computed: {
    address() {
      return apiStore().address;
    },
  },
  data: () => ({
    price: 0,
    delivery_fee: null,
    title: null,
    description: null,
    images: [],
    video: '',
    imageUrl: [],
    value: 0,
    pin_profile: false,
    imageIds: [],
    error: null,
    loadingImage: false,
    loadingData: false,
    imagePreviews: [],
    selectedCategories: [],
    list_specification: [],
    discount_codes: [],
    list_color: [],
    rules: [],
  }),
  mounted() {
    if (this.id != null) this.getData();
  },
  methods: {
    validateDeliveryFee(value) {
      if (value === null || value === '') {
        return true;
      }
      if (isNaN(value)) {
        return 'فقط عدد وارد کنید';
      }
      return true;
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
      this.imagePreviews = [];
      this.images.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
      this.sendDataFunc();
    },
    async sendData() {
      const list_specification_id = [];
      const list_color_id = [];
      const discount_codes_id = [];
      this.list_specification.forEach((element) => {
        list_specification_id.push(element.id);
      });
      if (this.list_color.length !== 0) {
        this.list_color.forEach((element) => {
          list_color_id.push(element.id);
        });
        this.discount_codes.forEach((element) => {
          discount_codes_id.push(element.id);
        });

        const formDic = {};
        formDic.category = this.selectedCategories;
        formDic.image = this.imageIds;
        formDic.video = this.video;
        formDic.title = this.title;
        formDic.description = this.description;
        formDic.delivery_fee = this.delivery_fee;
        formDic.price = this.price;
        formDic.discount = this.value;
        formDic.pin_profile = this.pin_profile;
        formDic.Specification = list_specification_id;
        formDic.colors = list_color_id;
        if (discount_codes_id.length > 0) {
          formDic.discount_codes = discount_codes_id;
        }
        const header = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Token ${useUserStore().userToken}`,
          },
        };
        const url =
          this.id != null
            ? `/api/product/seller-panel/product-retrieve-update-destroy/${this.id}/`
            : '/api/product/seller-panel/add-product/';
        try {
          if (this.id != null) {
            await axios.put(`${apiStore().address}${url}`, formDic, header);
          } else {
            await axios.post(`${apiStore().address}${url}`, formDic, header);
          }
          this.$emit('close');
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        this.error = 'اضافه کردن رنگ ضروری است';
      }
    },
    getData() {
      this.loadingData = true;
      axios
        .get(`${apiStore().address}/api/product/seller-panel/product-retrieve-update-destroy/${this.id}/`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${useUserStore().userToken}`,
          },
        })
        .then((response) => {
          this.loadingData = false;
          this.description = response.data.description;
          this.title = response.data.title;
          this.video = response.data.video;
          this.delivery_fee = response.data.delivery_fee;
          this.pin_profile = response.data.pin_profile;
          response.data.image.forEach((element) => {
            this.imageIds.push(element.id);
          });
          response.data.image.forEach((element) => {
            this.imageUrl.push(element.id);
          });
          response.data.category.forEach((element) => {
            this.selectedCategories.push(element.id);
          });
          this.price = response.data.price;
          this.value = response.data.discount;
          this.list_specification = response.data.Specification;
          this.list_color = response.data.colors != null ? response.data.colors : [];
          this.discount_codes = response.data.discount_codes != null ? response.data.discount_codes : [];
          if (response.data.discount) this.discount = true;
        });
    },
    removeImage(id) {
      const idx = this.imageIds.indexOf(id);
      if (idx > -1) {
        this.imageIds.splice(idx, 1);
      }
    },
  },
};
</script>

<style>
.fixed-top-left {
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1000;
}

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
