<script setup>
const props = defineProps({ item: Object });
</script>

<template>
    <v-list-subheader color="darkText" class="grey100 smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold rtl">{{ props.item.header}}</v-list-subheader>
    
</template>
