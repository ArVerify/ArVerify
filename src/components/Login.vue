<template>
  <div>
    <div class="h-64 w-full border border-dashed border-gray-500">
      <label for="file-upload" class="block w-full h-64 text-center">
        Click or drag your key-file to login
      </label>
      <input id="file-upload" @change="addFile" class="hidden" type="file">
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login",
        methods: {
            addFile(event) {
                let file = event.target.files[0]

                let reader = new FileReader();
                reader.readAsText(file, "UTF-8");

                reader.onload = evt => {
                    let text = evt.target.result;
                    try {
                        JSON.parse(text);
                        localStorage.setItem('jwk', text)
                    } catch (e) {
                        alert("Sorry, your file doesn't appear to be valid JSON data.");
                    }
                }

                location.reload()
            }
        }
    }
</script>

<style scoped>

</style>