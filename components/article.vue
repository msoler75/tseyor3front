<template>
    <div class="article">
        <slot></slot>
    </div>
</template>

<style scoped>
    .article >>> h1,
    .article >>> h2,
    .article >>> h3,
    .article >>> h4,
    .article >>> h5,
    .article >>> h6,
    .article >>> hr,
    .article >>> p {
    @apply max-w-[30rem] mx-auto;
  }

  .article >>> p {
    @apply my-2;
  }

  .article >>> img {
    @apply mx-auto;
    max-height: 90vh;
  }
</style>
