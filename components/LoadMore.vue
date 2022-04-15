<template>
    <section class="flex justify-center">
        <div v-if="localValue">
            <span class="btn font-bold text-xl rounded-full">
                <span class="inline-block animate-spin">+</span>
            </span>
        </div>
        <div v-else>
            <button @click="$emit('click')" class="btn font-bold text-xl rounded-full">
                <span class="inline-block">+</span>
            </button>
        </div>
    </section>
</template>

<script>
import vmodel from '@/mixins/vmodel'
export default {
    mixins: [vmodel]
}
</script>