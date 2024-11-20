<template>
    <v-container >
        <SectionAddChangeProduct :id="$route.params.id"  @cancel="$router.push('/products')" @close="$router.push('/products')" />
    </v-container>
</template>

<script>
</script>
