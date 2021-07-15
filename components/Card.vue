<template>
  <div class="card flex flex-col rounded overflow-hidden"
  :class="center?'text-center':''">
    <slot>
      <div v-if="cimage" class="max-w-full h-40 overflow-hidden">
        <img v-if="cimage.match(/^data:image/)" :src="cimage" class="w-full" />
        <nuxt-img v-else :src="cimage" class="w-full" :alt="ctitle"></nuxt-img>
      </div>
      <div class="px-6 py-4">
        <NLink :to="chref">
          <section class="font-bold text-xl mb-2"
          >{{ ctitle }}</section>
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
import CardMix from '@/mixins/card'
export default {
  mixins: [CardMix]
}
</script>