<template>
  <Card
  :clicked="clicked">
    <slot>
      <div class="h-40 overflow-hidden">
        <nuxt-img :src="cimage" class="w-full" />
      </div>
      <div class="px-6 py-4 flex flex-col">
        <div class="flex mb-2">
          <NLink :to="'/eventos/' + data.id"
           @click.native.prevent="clicked=true">
            <div class="font-bold text-xl mb-2 mr-4">{{ ctitle }}</div>
          </NLink>
          <CalendarDay :date="data.fechaComienzo" class="ml-auto" />
        </div>
        <v-clamp
          v-if="!noText && ctext"
          autoresize
          :max-lines="4"
          class="mt-auto text-gray-700 text-base"
        >{{ cteaser }}</v-clamp>
      </div>
    </slot>
  </Card>
</template>

<script>
import VClamp from 'vue-clamp'
import CardMix from '@/mixins/card'
export default {
  components: { VClamp },
  mixins: [CardMix],
  computed: {
    cimage() {
      let src = this.image || this.data.image || this.data.imagen;
      if (src && typeof src === "object") src = src.url;
      return src || this.$config.defaultImage
    }
  }
}
</script>
