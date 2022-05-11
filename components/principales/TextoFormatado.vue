<template>
    <!-- Formateamos el texto HTML -->
    <div class="text-formatado">
        <slot />
    </div>
</template>

<style scoped>
.text-formatado>>>h1,
.text-formatado>>>h2,
.text-formatado>>>h3,
.text-formatado>>>h4,
.text-formatado>>>h5,
.text-formatado>>>h6 {
    @apply text-center;
}

.text-formatado>>>a {
    color: #4589ef;
}

.text-formatado>>>hr {
    @apply my-8;
}

.text-formatado>>>ul,
.text-formatado>>>ol {
    @apply pl-5 my-4;
}

.text-formatado>>>hr,
.text-formatado>>>ul,
.text-formatado>>>ol,
.text-formatado>>>li,
.text-formatado>>>p {
    @apply max-w-[30rem] mx-auto;
}

.text-formatado {
    @apply pt-14;
    font-size: 1.1em;
}

.text-formatado>>>p {
    @apply mb-4;
}

.text-formatado>>>img {
    @apply mx-auto my-8 shadow rounded-sm;
    max-height: 90vh;
}

.text-formatado>>>img+img {
    @apply mt-0;
}

.text-formatado>>>figure {
    @apply mt-8 mb-14;
}

.text-formatado>>>figure img {
    @apply mt-0 mb-1;
}

.text-formatado>>>figcaption {
    @apply text-sm italic text-center;
}

.text-formatado>>>blockquote {
    @apply w-full max-w-none shadow text-base py-6 px-2 pl-6 my-14;
}
</style>