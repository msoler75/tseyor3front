<template>
  <div class="card flex flex-col rounded overflow-hidden"
  :class="center?'text-center':''">
    <slot>
      <!-- 
      <div v-if="cimage" class="card-img max-w-full h-40 overflow-hidden">
        <img v-if="cimage.match(/^data:image/)" :src="cimage" class="w-full" />
        <nuxt-img v-else :src="cimage" :sizes="imageSizes" class="w-full" :alt="ctitle"></nuxt-img>
      </div>
      -->
      <div v-if="cimage" :style="imageBg" class="card-img max-w-full h-40 flex-shrink-0"/>
      <div class="px-6 py-4 flex flex-col h-full">
        <NLink :to="chref">
          <section class="font-bold text-xl mb-2">{{ ctitle }}</section>
        </NLink>
        <v-clamp v-if="!noText && ctext" autoresize :max-lines="5"
        class="mt-auto text-gray-700 text-base">{{cteaser}}</v-clamp>
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
import VClamp from 'vue-clamp'
import CardMix from '@/mixins/card'
export default {
  components: { VClamp },
  mixins: [CardMix]
}
</script>

