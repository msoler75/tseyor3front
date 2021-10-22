<template>
    <div style="border-style:solid;" @dragover.prevent @drop.prevent>
      <input type="file" :multiple="multiple" @change="uploadFile"/>
      <div @drop="dragFile" class="bg-green-200 text-green-900 mt-4 mb-5 px-5 py-12 text-center">
        O arrastra el archivo aquí
        <div v-if="false && File.length">
          <ul v-for="file in File" :key="file.name">
            <li>{{file.name}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    props: {
        multiple: {type: Boolean, required: false, default: false}
    },
    data: () => ({ File: []}),
    methods: {
      uploadFile(e) {
        this.File = e.target.files;
        this.$emit("change", e)
      },
      dragFile(e) {
        this.File = e.dataTransfer.files;
        this.$emit("change", e)
      }
}
}
</script>