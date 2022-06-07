<template>
  <client-only>
    <div>
      <span
        :disabled="disabled"
        class="btn btn-gray text-sm"
        @click="onClick"
        :class="classButton"
      >
        <icon v-if="icon" :icon="icon" />
        <span :class="classButtonText" class="ml-2">{{ textButton }}</span>
      </span>
      <input
        v-if="onlyInput"
        ref="inp"
        type="file"
        :multiple="multiple"
        @change="onFileSelect"
        :accept="accept"
        class="absolute left-0 opacity-0 pointer-events-none"
      />
      <input
        :required="required"
        v-model="files"
        class="absolute left-0 opacity-0 pointer-events-none"
      />
      <Modal v-model="verModal" :title="title" class="sm:min-w-sm max-w-screen">
        <div class="p-5 max-w-full">
          <Drop
            v-if="!files.length"
            @change="onFileSelect"
            :multiple="multiple"
            :accept="accept"
          />
          <div v-if="files.length">
            <div class="space-y-2 max-h-[60vh] overflow-y-auto">
              <div
                v-for="(file, index) of files"
                :key="index"
                class="flex w-full pr-2"
              >
                <div
                  class="
                    flex
                    w-16
                    mr-1
                    text-gray
                    justify-center
                    items-start
                    text-2xl
                  "
                >
                  <icon :icon="iconFromExt(getExtension(file.name))" />
                </div>
                <div class="w-full text-sm text-left">
                  <a target="_blank" :href="file.path" download>{{
                    file.name
                  }}</a>
                  <div
                    class="flex w-full justify-between text-xs text-diminished"
                  >
                    <span class="ml-auto"
                      >{{ Math.round(file.size / 1024) }} Kb</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="flex space-x-4 mt-9 justify-center">
              <div class="btn" @click="doAccept">
                <icon icon="check" class="mr-2" />
                {{ textAccept }}
              </div>
              <div class="btn btn-error" @click="discard">
                <icon icon="fas fa-times" class="mr-2" />
                {{ textCancel }}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </client-only>
</template>

<script>
import fileIcon from "~/mixins/fileIcon.js";
export default {
  props: {
    icon: { type: String | Boolean, required: false, default: "file-upload" },
    textButton: {
      type: String,
      required: false,
      default: "Subir o cambiar archivo",
    },
    textAccept: { type: String, required: false, default: "Aceptar" },
    textCancel: { type: String, required: false, default: "Descartar" },
    title: { type: String, required: false, default: "Elegir archivo/s" },
    classButton: { type: String, required: false, default: "" },
    classButtonText: { type: String, required: false, default: "" },
    disabled: { type: Boolean, required: false, default: false },
    required: { type: Boolean, required: false, default: false },
    multiple: { type: Boolean, required: false, default: false },
    accept: { type: String, required: false, default: "*/*" },
    onlyInput: { type: Boolean, required: false, default: false },
    value: {}, // to reset state,
  },
  data() {
    return {
      verModal: false,
      files: [],
    };
  },
  mixins: [fileIcon],
  methods: {
    onClick() {
      if (this.onlyInput) this.$refs.inp.click();
      else this.verModal = !this.disabled;
    },
    onFileSelect(e) {
      var f = e.target.files || e.dataTransfer.files;
      var files = [];
      for (var i = 0; i < f.length; i++) files.push(f[i]);
      console.log("F", files);
      if (!files.length) return;
      const regex = new RegExp(this.accept.replace(/\*/, "[^/]*"));
      files = files.filter((file) => {
        console.log("test", regex, file);
        var ok = regex.test(file.type);
        console.log("ok", ok);
        return ok;
      });
      console.log("FILES", files);
      if (!files.length) return;
      this.files = files;
      console.log("onlyInput", this.onlyInput);
      if (this.onlyInput) this.$emit("change", files);
    },
    doAccept() {
      this.verModal = false;
      this.$emit("change", this.files);
    },
    discard() {
      this.files = [];
      this.verModal = false;
    },
  },
  watch: {
    value(newValue) {
      this.files = [];
    },
  },
};
</script>
