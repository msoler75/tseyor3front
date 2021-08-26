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
    .article >>> h6 
    {
      @apply text-center;
    }

.article >>> a { 
    color: #4589ef;
  }

  .article >>> hr {
    @apply my-8;
  }

  .article >>> ul,
  .article >>> ol {
    @apply pl-5 my-4;
  }

  .article >>> hr,
  .article >>> ul,
  .article >>> ol,
  .article >>> li,
  .article >>> p {
    @apply max-w-[30rem] mx-auto;
  }

  .article {
    @apply pt-14;
    font-size: 1.1em;
  }

  .article >>> p {
    @apply mb-4;
  }

  .article >>> img {
    @apply mx-auto my-8 shadow rounded-sm;
    max-height: 90vh;
  }

  .article >>> img + img {
    @apply mt-0;
  }

  .article >>> figure {
    @apply mt-8 mb-14;
  }

  .article >>> figure img {
    @apply mt-0 mb-1;
  }

  .article >>> figcaption {
    @apply text-sm italic text-center;
  }

  .article >>> blockquote {
    @apply w-full max-w-none shadow text-base py-6 px-2 pl-6 my-14;
  }
  
</style>
