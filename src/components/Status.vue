<template>
  <div class="flex flex-col justify-center">
    <div class="text-center font-bold text-2xl">Your Status.</div>
    <div class="text-center font-bold text-2xl text-red-500">unverified</div>
    <div>
      <div class="flex justify-center">
        <status-circle></status-circle>
      </div>
    </div>
  </div>
</template>

<script>
    import StatusCircle from "./StatusCircle";

    export default {
        name: "Status",
        components: {StatusCircle}
    }
</script>

<style scoped>

</style>