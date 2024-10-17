<template>
    <v-container >
        <SectionAddChangeDigitalProduct :id="$route.params.id"  @cancel="$router.push('/products')" @close="$router.push('/products')" />
    </v-container>
</template>

<script>
</script>