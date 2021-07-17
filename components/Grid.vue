<template>
    <section class="grid gap-4">
        <slot />
    </section>
</template>

<style scoped>
.grid:not([class*='grid-cols-']) {
    grid-template-columns: repeat(auto-fit, minmax( 16rem	 , 1fr))
}
</style>