<template>
    <v-locale-provider rtl>
    <v-checkbox @click="valueData = 0 " v-model="discount" color="primary"
    label="دارای تخفیف">
</v-checkbox>
</v-locale-provider>
<v-slide-y-transition>
    <v-row v-if="discount" class="mt-1 mb-5 rtl">
        <v-col cols="12" md="6">
            <v-text-field label="درصد تخفیف" rounded="lg" :max="100" min="1" v-model="valueData" required type="number" persistent-hint
                variant="outlined" color="primary" />
        </v-col>
        <v-col cols="12" md="9" hidden>
            <v-slider label="" variant="outlined" color="primary" class="mt-3"
                v-model="valueData" :min="0" :max="100" :step="1" thumb-label></v-slider>
        </v-col>
    </v-row>
</v-slide-y-transition>

</template>
<script>
import { PlusIcon, TrashIcon, CheckIcon } from 'vue-tabler-icons';
import { useUserStore } from '~/store/user';
import { apiStore } from '~/store/api';

import axios from 'axios';

export default {
    emits: ["change"],
    props: ["value",],
    components: {
        PlusIcon, TrashIcon,
        CheckIcon
    },
    data() {
        return {
            first_time: true,
            discount: false,
            valueData:0
        }
    },
    methods: {
        initializeState() {
            this.discount = this.value > 0; // Set discount based on initial value
            this.valueData = this.value;   // Sync valueData with value
        },
    },
    mounted() {
        this.initializeState();
    },
    watch: {
        value: {
            handler(newVal) {
                if(this.first_time) {
                    this.initializeState()
                }
                if(this.discount) {
                    this.first_time = false
                }
            },
            immediate: true,
        },
        valueData: {
            handler: function (val, oldVal) {
                this.$emit("change", val)
            },

        },

    },
}
</script>