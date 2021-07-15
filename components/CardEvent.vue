<template>
  <Card>
    <slot>
      <div class="h-40 overflow-hidden">
        <nuxt-img :src="cimage" class="w-full" />
      </div>
      <div class="flex px-6 py-4">
        <NLink :to="'/eventos/' + data.id">
          <div class="font-bold text-xl mb-2 mr-4">
            {{ ctitle }}
          </div>
        </NLink>
        <CalendarDay :date="data.fechaInicio" class="ml-auto" />
      </div>
      <div class="px-6 pb-4 text-diminished" v-html="ctext" />
    </slot>
  </Card>
</template>

<script>
import CardMix from '@/mixins/card'
export default {
  mixins: [CardMix],
};
</script>
