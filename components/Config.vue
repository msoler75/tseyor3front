<template>
    <div class="w-full">
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        contained: {
            type: Boolean,
            required: false,
            default: true
        },
        background: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    mounted() {
        if(!this.contained)
            this.$store.commit('setContained', false)
        if(!this.background)
            this.$store.commit('setBackground', false)
    }
}
</script>

