<template>
  <NuxtDynamic v-if="data" :component="currentComponent" 
  class="card flex flex-col rounded shadow-lg overflow-hidden"
  :image="image"
  :imageSizes="imageSizes"
  :imageWidth="imageWidth"
  :title="title"
  :text="text"
  :noText="noText"
  :href="href"
  :tags="tags"
  :showTags="showTags"
  :data="data"
  :center="center"
  book-size="book-sm"
  :class="ccollection==='libros'?'py-5 text-center':''"
  :collection="collection"
  :clicked="clicked"
  />
</template>

<script>
import CardMix from '@/mixins/card'
export default {
  mixins: [CardMix],
  computed: {
    currentComponent () {
      if(this.ccollection === 'libros') return 'CardLibro'
      if(this.ccollection === 'eventos') return 'CardEvento'
      if(this.ccollection === 'cursos') return 'CardEvento'
      return 'Card'
    }
  }
};
</script>
