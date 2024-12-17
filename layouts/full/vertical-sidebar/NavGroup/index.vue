<script setup>
const props = defineProps({ item: Object });
</script>

<template>
    <v-list-subheader  class="text-grey smallCap text-uppercase text-subtitle-2 mt-1 font-weight-bold rtl">{{ props.item.header}}</v-list-subheader>
    
</template>
