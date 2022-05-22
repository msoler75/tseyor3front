<template>
  <div class="flex w-full overflow-hidden">
    <div
      class="flex flex-shrink-0 text-gray justify-center items-center"
      :class="boxClass"
    >
      <icon :icon="iconFromExt(data.media.ext)" :class="iconClass" />
    </div>
    <div class="w-full flex justify-between items-center">
      <div class="w-full overflow-ellipsis">
        <a
          target="_blank"
          :href="data.media.url"
          download
          class="leading-4 inline-flex"
          :class="textClass"
          style="
            display: inline-block;
            max-width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
          >{{ data.nombre }}</a
        >
        <div
          class="flex w-full justify-between text-xs text-diminished"
          :class="subtextClass"
        >
          <span v-if="mostrarTamano" class="w-1/3 flex-grow-0 flex-shrink-0"
            >{{ data.media.size }} Kb</span
          >
          <span v-if="mostrarFecha" class="ml-auto w-1/3 text-right">{{
            $dayjs(data.media.updatedAt).fromNow()
          }}</span>
        </div>
      </div>
      <span
        v-if="mostrarControles"
        class="cursor-pointer text-gray text-xl ml-2 pl-2 pr-1"
        @click="$emit('propiedades')"
        >&vellip;</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
};
</script>