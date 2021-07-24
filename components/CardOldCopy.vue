<template>
  <div :is="currentComponent" class="card flex flex-col rounded shadow-lg overflow-hidden">
    <slot>
      <div v-if="cimage" class="max-w-full h-40 overflow-hidden">
        <img v-if="cimage.match(/^data:image/)" :src="cimage" class="w-full" />
        <nuxt-img v-else :src="cimage" class="w-full" :alt="ctitle"></nuxt-img>
      </div>
      <div class="px-6 py-4">
        <NLink :to="chref">
          <div class="font-bold text-xl mb-2">{{ ctitle }}</div>
        </NLink>
        <p
          v-if="!noText && ctext"
          class="text-gray-700 text-base"
          v-html="ctext"
        />
      </div>
      <div v-if="showTags" class="px-6 pt-4 pb-2 mt-auto">
        <span
          v-for="tag of ctags"
          :key="tag"
          class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
        >
          {{ tag }}
        </span>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: false,
      default: ""
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    text: {
      type: String,
      required: false,
      default: ""
    },
    noText: {
      type: Boolean,
      required: false,
      default: false
    },
    href: {
      type: String,
      required: false,
      default: ""
    },
    tags: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    showTags: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    }
  },
  computed: {
    ctitle() {
      return (
        this.title ||
        this.data.title ||
        this.data.titulo ||
        this.data.titular ||
        this.data.name ||
        this.data.nombre
      );
    },
    chref() {
      const r =
        this.href || this.data.href || this.data.url || this.data.enlace;
      if (!r && this.data) {
        return '/' + (
          (this.data.class ||
            this.data.table ||
            this.data.tabla ||
            this.data.clase) +
          "/" +
          this.data.id
        );
      }
      return r;
    },
    ctext() {
      return (
        this.text ||
        this.data.text ||
        this.data.texto ||
        this.data.description ||
        this.data.descripcion
      );
    },
    ctags() {
      return this.tags || this.data.tags || this.data.etiquetas;
    },
    cclase () {
      return this.data?this.data.clase:'default'
    },
    cimage() {
      const src = this.image || this.data.image || this.data.imagen;
      if (src.search("/") > -1) return src;
      return "./images/" + src;
    }
  }
};
</script>
