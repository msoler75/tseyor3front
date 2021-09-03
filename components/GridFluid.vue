<template>
    <section class="grid grid-fluid">
        <slot/>
    </section>
</template>

<style scoped>
.grid-fluid > * {
    @apply min-h-8 max-h-[400px] border border-gray-200 dark:border-gray-900 rounded-md shadow;
  }
@screen md {
  .grid-fluid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(350px, 1fr));
    grid-auto-columns: minmax(320px, 400px);
    grid-auto-rows: minmax(320px, 400px);
    grid-auto-flow: dense;
    place-items: stretch stretch;
  }
  .grid-fluid >>> *.cols-2 {
    grid-column-end: span 2;
  }
  .grid-fluid >>> *.rows-2 {
    grid-row-end: span 2;
  }
}
</style>