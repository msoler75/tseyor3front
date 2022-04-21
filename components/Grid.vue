<template>
    <section class="grid gap-4">
        <slot />
    </section>
</template>

<style scoped>
.grid:not([class*='grid-cols-']) {
    grid-template-columns: repeat(auto-fill, minmax( 24rem	 , 1fr))
}
/* to-do: ? https://css-irl.info/controlling-leftover-grid-items/ */
</style>