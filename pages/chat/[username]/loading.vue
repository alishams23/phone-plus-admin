<template>
    <div class="h-full" style="min-height: 100%; max-height: 100%; height: 100%">
       
        <div
      class="d-flex flex-row h-full lg:bg-white pt-4 p-0 m-0"
      style="min-height: 100%; max-height: 100%; height: 100%"
    >
    
            <div class="d-flex flex-row justify-content-center col-12 align-items-center">
                <span class="loader"></span>
            </div>
        </div>
    </div>
</template>

<script>
export default{
  
  setup() {
    definePageMeta({
      layout: "chat",
    })
  },
}
</script>