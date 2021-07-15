<template>
    <div class="w-full">
        <slot />
    </div>
</template>

<script>
export default {
    mounted() {
        this.$store.commit('setContained', false)
    }
}
</script>

