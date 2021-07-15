<template>
    <section class="grid gap-4">
        <slot />
    </section>
</template>

<style scoped>
.grid:not([class*='grid-cols-']) {
    @apply grid-cols-fill-w-64;
}
</style>