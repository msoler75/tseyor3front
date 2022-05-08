<template>
  <div style="border-style:solid;" @dragover.prevent @drop.prevent>
    <input type="file" :multiple="multiple" @change="uploadFile" :accept="accept" />
    <div @drop="dragFile" class="bg-green-200 text-green-900 mt-4 mb-5 px-5 py-12 text-center">
      {{ dragHereMessage }}
      <div v-if="false && files.length">
        <ul v-for="file in files" :key="file.name">
          <li>{{ file.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    multiple: { type: Boolean, required: false, default: false },
    accept: { type: String, required: false, default: '' },
    dragHereMessage: { type: String, required: false, default: 'O arrastra el archivo aquí' }
  },
  data: () => ({ files: [] }),
  methods: {
    uploadFile(e) {
      this.files = e.target.files;
      this.$emit("change", e)
    },
    dragFile(e) {
      this.files = e.dataTransfer.files;
      this.$emit("change", e)
    }
  }
}
</script>