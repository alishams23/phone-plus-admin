<template>
    <v-container >
        <SectionAddChangeProduct :id="$route.params.id"  @cancel="$router.push('/digitalProducts')" @close="$router.push('/digitalProducts')" />
    </v-container>
</template>

<script>
</script>
