<template>
  <Card center class="p-5">
    <slot>
      <div class="mx-auto w-28 h-28 overflow-hidden rounded-full">
        <nuxt-img :src="cimage" class="w-full h-full" fit="cover" />
      </div>
      <div class="py-4">
        <NLink :to="'/usuarios/' + data.id" class="inline-block w-full font-bold text-xl mb-2 mr-4">
            {{ ctitle }}
        </NLink>
      </div>
      <div class="pb-4 text-diminished" 
      :class="data.stats?'':'mt-auto'"
      v-html="ctext" />
      <section v-if="data.stats" class="w-20 mx-auto mt-auto flex flex-wrap justify-between text-diminished text-xs">
          <span v-for="(stat, key) of data.stats" :key="key" class="mx-1" :title="$ucFirst(index)">{{stat.value}} <icon :icon="stat.icon" class="ml-1"/>  </span>
      </section>
    </slot>
  </Card>
</template>

<script>
import CardMix from '@/mixins/card'
export default {
  mixins: [CardMix],
  computed: {
      cimage () {
          return '/assets/images/usuarios/' + (this.image || this.data.image || this.data.imagen)
      }
  }
};
</script>
