<template>
  <CarpetaElemento
    v-if="localValue"
    :tag="seleccionando ? 'div' : 'a'"
    :vista="vista"
    :seleccionando="seleccionando"
    :iconClass="iconClass"
    :boxClass="boxClass"
    :textClass="textClass"
    :subtextClass="subtextClass"
    :mostrarTitulo="mostrarTitulo"
    :mostrarControles="mostrarControles"
    :mostrarTamano="mostrarTamano"
    :mostrarFecha="mostrarFecha"
    :mostrarDescripcion="mostrarDescripcion"
    :uploading="localValue.uploading"
    :publishedAt="localValue.publishedAt"
    :nombre="localValue.nombre"
    target="_blank"
    :href="
      localValue.media && localValue.media.url ? localValue.media.url : '#'
    "
    download    
  >
    <template v-slot:icon>
      <nuxt-img
        v-if="
          localValue.media &&
          localValue.media.url &&
          localValue.media.url.match(/^data:image\/|\.(png|jpe?g|webp|svg|)$/i)
        "
        :src="localValue.media.url"
        fit="cover"
        :width="vista == 'listado' ? 71 : 120"
        :height="vista == 'listado' ? 51 : 95"
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
        :class="
          (vista == 'listado' ? 'text-4xl' : 'text-7xl py-1') + ' ' + iconClass
        "
      />
    </template>

    <template v-slot:description>
      <span v-if="mostrarTamano" class="capitalize">
        {{ localValue.media ? Math.round(localValue.media.size) : 0 }}
        Kb.&nbsp;
      </span>
      <span v-if="mostrarFecha" class="capitalize">{{
        localValue.media
          ? $dayjs(localValue.media.createdAt).format("DD MMM YYYY, HH:mm")
          : ""
      }}</span>
    </template>
  </CarpetaElemento>
</template>


<script>
import vmodel from "@/mixins/vmodel";
import fileIcon from "~/mixins/fileIcon.js";
export default {
  mixins: [vmodel, fileIcon],
  props: {
    vista: { type: String, required: false, default: "listado" },
    seleccionando: { type: Boolean, required: false, default: false },
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    mostrarTitulo: { default: true },
    mostrarControles: {
      type: Boolean,
      required: false,
      default: false,
    },    
    mostrarTamano: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarDescripcion: { type: Boolean, required: false, default: true },
  }  
};
</script>