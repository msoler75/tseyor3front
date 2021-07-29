<template>
  <NuxtDynamic v-if="data" :component="currentComponent" 
  class="card flex flex-col rounded shadow-lg overflow-hidden"
  :image="image"
  :imageSizes="imageSizes"
  :title="title"
  :text="text"
  :noText="noText"
  :href="href"
  :tags="tags"
  :showTags="showTags"
  :data="data"
  :center="center"
  book-size="book-sm"
  :class="data.clase==='libros'?'py-5 text-center':''"
  />
</template>

<script>
import CardMix from '@/mixins/card'
export default {
  mixins: [CardMix],
  computed: {
    currentComponent () {
      if(!this.data) return 'Card'
      if(this.data.clase === 'libros') return 'CardBook'
      if(this.data.clase === 'eventos') return 'CardEvent'
      if(this.data.clase === 'cursos') return 'CardEvent'
      return 'Card'
    }
  }
};
</script>
