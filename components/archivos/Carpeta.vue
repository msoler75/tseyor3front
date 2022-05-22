<template>
  <div class="flex w-full overflow-hidden">
    <div
      class="flex flex-shrink-0 justify-center items-center group"
      :class="
        boxClass + (data.publishedAt ? ' text-orange-200' : ' text-gray-500')
      "
    >
      <div
        v-if="data.nombreMostrar === '..'"
        class="relative flex justify-center items-center"
        :class="data.publishedAt ? 'cursor-pointer' : ''"
        @click="onClick"
      >
        <icon icon="fas fa-folder" class="absolute" :class="iconClass" />
        <icon
          icon="fas fa-arrow-left"
          class="group-hover:-translate-x-1 text-xs text-black absolute"
        />
      </div>
      <div v-else class="flex items-center justify-center">
        <icon
          icon="folder"
          :class="
            iconClass +
            (data.publishedAt ? ' group-hover:hidden cursor-pointer' : '')
          "
          @click.native="onClick"
        />
        <icon
          v-if="data.publishedAt"
          icon="folder-open"
          class="hidden group-hover:block cursor-pointer"
          :class="iconClass"
          style="transform: translate(2.5px, -1px)"
          @click.native="onClick"
        />
      </div>
    </div>
    <div
      class="w-full overflow-ellipsis flex flex-col justify-center items-start"
    >
      <a
        target="_blank"
        class="font-bold text-gray-dark-900 dark:text-gray-50"
        :class="
          textClass +
          (data.publishedAt ? ' cursor-pointer' : ' pointer-events-none')
        "
        @click.stop.prevent="onClick"
        :href="data.ruta"
        >{{ data.nombreMostrar || data.nombre }}</a
      >
      <div
        class="flex w-full justify-between text-xs text-diminished"
        :class="subtextClass"
      >
        <span v-if="mostrarFecha" class="capitalize">{{
          $dayjs(data.createdAt).format("DD. MMM. YYYY, HH:mm")
        }}</span>
      </div>
    </div>
    <span
      v-if="mostrarControles && data.nombreMostrar !== '..'"
      class="self-center cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
      >&vellip;</span
    >
    <span v-else-if="mostrarControles" class="ml-2 pl-2 pr-1">&nbsp;</span>
    <FolderProps
      v-if="mostrarControles && data.nombreMostrar !== '..'"
      textAccept="Guardar"
      :value="data"
      :showIt="mostrarProps"
      @close="mostrarProps= false"
    />
  </div>
</template>

<script>
export default {
  props: {
    mostrarControles: {},
    data: {},
    textClass: {},
    subtextClass: {},
    iconClass: { type: String, required: false, default: "text-6xl" },
    boxClass: { type: String, required: false, default: "w-16 mr-3" },
    mostrarFecha: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      mostrarProps: false
    }
  },
  methods: {
    onClick() {
      this.$emit("click", this.data);
    },
  },
};
</script>
