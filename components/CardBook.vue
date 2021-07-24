<template>
  <Card class="card-book"
  :class="(landscape ? 'landscape' : '')+(big?' big-wrap':'')">
    <section :class="landscape ? 'xm:flex' : ''">
      <section class="flex-grow sm:pt-2">
        <Book3D class="mx-auto"
        :class="sizeBook"
         :src="'/images/portadas/' + data.imagen"/>
        <!-- <nuxt-img class="block xs:hidden max-w-8" :src="'/images/portadas/' + data.imagen"/> -->
      </section>
      <section class="px-1 pb-4 xs:px-6 text-center"
      :class="landscape?'flex flex-col justify-center':''">
        <NLink :to="'/libros/' + data.id" class="mt-6 mb-2 font-bold text-xl">{{
          ctitle
        }}</NLink>
        <p
          v-if="!noText && ctext"
          class="text-gray-700 text-base"
          v-html="ctext"
        />
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
import CardMix from "@/mixins/card";
export default {
  mixins: [CardMix],
  props: {
    landscape: { type: Boolean, required: false, default: false },
    big: { type: Boolean, required: false, default: false },
    bookSize: {
      type: String,
      required: false,
      default: 'auto'
    }
  },
  computed: {
    cclase() {
      return "libros";
    },
    sizeBook() {
      if(this.bookSize==='auto') return 'xs:book-xs sm:book-sm md:book-md'
      return this.bookSize
    }
  }
};
</script>

<style scoped>
</style>
