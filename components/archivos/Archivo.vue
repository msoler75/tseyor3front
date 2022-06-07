<template>
  <component
    :is="seleccionando ? 'div' : 'a'"
    target="_blank"
    :href="
      localValue.media && localValue.media.url ? localValue.media.url : '#'
    "
    :class="
      (!localValue.publishedAt || localValue.uploading
        ? 'pointer-events-none'
        : '') +
      (seleccionando && seleccionado ? ' !bg-yellow-200' : '') +
      (seleccionando ? ' pointer-events-auto cursor-pointer' : '')
    "
    download
    class="flex w-full"
    @click="seleccionar"
  >
    <Check v-if="seleccionando" v-model="seleccionado" class="w-8" />
    <div
      class="flex flex-shrink-0 justify-center items-center"
      :class="boxClass"
    >      
      <nuxt-img
        v-if="
          localValue.media &&
          localValue.media.url &&
          localValue.media.url.match(/^data:image\/|\.(png|jpe?g|webp|svg|)$/i)
        "
        :src="localValue.media.url"
        fit="cover"
        width="71"
        height="71"
        class="rounded-lg"
      />
      <icon
        v-else
        class="text-gray"
        :icon="
          localValue.media && localValue.media.ext
            ? iconFromExt(localValue.media.ext)
            : 'file'
        "
        :class="iconClass"
      />
    </div>
    <div class="flex flex-col justify-center items-start">
      <span
        :title="localValue.nombre"
        class="
          w-40
          xm:w-48          
          lg:w-64
          max-w-full
          overflow-hidden overflow-ellipsis
          whitespace-nowrap
          font-bold
          text-gray-dark-900
          dark:text-gray-50
        "
        :class="
          textClass +
          (localValue.publishedAt ? ' cursor-pointer' : ' pointer-events-none')"
        >{{ localValue.nombre }}</span
      >
      <div
        class="flex w-full justify-start text-xs text-diminished"
        :class="subtextClass"
      >
        <span v-if="mostrarTamano" class="capitalize">
          {{
            localValue.media ? Math.round(localValue.media.size) : 0
          }}
          Kb.&nbsp;
        </span>
        <span v-if="mostrarFecha" class="capitalize">{{
          localValue.media
            ? $dayjs(localValue.media.createdAt).format("DD MMM YYYY, HH:mm")
            : ""
        }}</span>
      </div>
    </div>
    <span
      v-if="!seleccionando && !localValue.uploading && mostrarControles"
      class="cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
      @click="$emit('propiedades')"
      >&vellip;</span
    >
  </component>
</template>


<script>
import vmodel from "@/mixins/vmodel";
import fileIcon from "~/mixins/fileIcon.js";
export default {
  mixins: [vmodel, fileIcon],
  props: {
    mostrarControles: {
      type: Boolean,
      required: false,
      default: false,
    },
    seleccionando: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarTamano: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      seleccionando: false,
      seleccionado: false,
    };
  },
  watch: {
    seleccionado(newValue) {
      if (newValue) this.$emit("seleccionado");
      else this.$emit("deseleccionado");
    },
  },
  methods: {
    seleccionar() {
    if (
        this.seleccionando &&
        this.localValue &&
        this.localValue.publishedAt
      )
        this.seleccionado = !this.seleccionado;
    }
  }
};
</script>