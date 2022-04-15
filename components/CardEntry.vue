<template>
    <Card class="flex-row">
        <NLink :style="imageBg" class="w-40 h-32 flex-shrink-0 mr-4" :to="chref" />
        <div class="space-y-1 flex-grow">
            <NLink :to="chref" class="font-serif leading-tight sm:text-base md:text-lg lg:text-xl font-bold">{{
                data.titulo
            }}
            </NLink>
            <slot/>
            <v-clamp autoresize :max-lines="3" class="text-base text-diminished">{{ cteaser }}</v-clamp>
        </div>
    </Card>
</template>

<script>
import VClamp from 'vue-clamp'
import CardMix from '@/mixins/card'
export default {
    components: { VClamp },
    mixins: [CardMix]
}
</script>
