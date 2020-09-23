<template>
  <div>
    <div :class="`border border-dashed border-${color}-700 rounded-full p-4`">
      <div :class="`border-20 border-${color}-700 rounded-full`">
        <div class="h-48 w-48">
          <div class="h-full flex p-2">
            <div :class="`w-full self-center text-center text-3xl text-${color}-700`"><div v-html="buttonHtml"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "StatusCircle",
        props: ["color", "buttonHtml"]
    }
</script>

<style scoped>

</style>