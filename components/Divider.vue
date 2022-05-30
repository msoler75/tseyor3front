<template>
    <div class="divider h-1 w-full flex justify-center">
        <div class="linebar shadow-sm w-full"></div>
    </div>
</template>

<style scoped>
.linebar {
    --tw-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.dark .linebar  {
   --tw-shadow: 0 2px 2px 0 rgba(255, 255, 255, 0.35);
    box-shadow: var(--tw-shadow);
}
.divider:not([class*='my-']) {
    @apply my-4 sm:my-8 lg:my-12;
}
</style>
