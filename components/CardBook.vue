<template>
  <Card class="card-book h-full"
  :class="landscape ? 'landscape' : ''"
  :clicked="clicked"
  >
    <section class="h-full flex flex-col justify-start" :class="landscape ? 'xm:flex' : ''">
      <section class="sm:pt-2">
        <Book3D class="mx-auto"
          :class="sizeBook"
          :src="cimage"
         />
        <!-- <nuxt-img class="block xs:hidden max-w-8" :src="'/imagenes/portadas/' + data.imagen"/> -->
      </section>
      <section class="px-1 xs:px-6 text-center flex flex-col flex-grow" :class="landscape?'flex flex-col justify-center':''">
        <NLink :to="chref" @click.native.prevent="clicked=true">
          <section class="font-bold text-xl" :class="noText?'':'mb-2'">{{ ctitle }}</section>
        </NLink>
        <v-clamp v-if="!noText && ctext" autoresize :max-lines="5"
        class="my-auto text-gray-700 text-base">{{cteaser}}</v-clamp>
        <div v-if="showTags" class="px-6 pt-4 pb-2 mt-auto">
          <span
            v-for="tag of ctags"
            :key="tag"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {{ tag }}
          </span>
        </div>
      </section>
    </section>
  </Card>
</template>

<script>
import VClamp from 'vue-clamp'
import CardMix from "@/mixins/card";
export default {
  components: { VClamp },
  mixins: [CardMix],
  props: {
    landscape: { type: Boolean, required: false, default: false },
    // big: { type: Boolean, required: false, default: false },
    bookSize: {
      type: String,
      required: false,
      default: 'auto'
    }
  },
  computed: {
    ccollection() {
      return "libros";
    },
    sizeBook() {
      if(this.bookSize==='auto') return 'xs:book-xs sm:book-sm md:book-md'
      return this.bookSize
    }
  }
}
</script>
