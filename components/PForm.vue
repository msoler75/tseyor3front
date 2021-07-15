<template>
    <form class="PForm max-w-lg w-full mx-auto px-1 py-4 sm:px-4 md:px-7 sm:py-8 bg-blue-gray-50 text-blue-gray select-none">
        <slot/>
    </form>
</template>

<style scoped>
.PForm {
    /* https://www.transparenttextures.com/ */
}
.PForm >>> svg {
  fill: currentColor;
  stroke: currentColor;
}
.PForm >>> h1, 
.PForm >>> h2, 
.PForm >>> h3, 
.PForm >>> span,
.PForm >>> a,
.PForm >>> label, 
.PForm >>> p {
    --tw-shadow: rgba(236, 239, 241, .3);
     text-shadow: 0px 0px 4px var(--tw-shadow), -3px 0 6px var(--tw-shadow), 3px 0 6px var(--tw-shadow), 0 -3px 6px var(--tw-shadow), 0 3px 6px var(--tw-shadow), -3px -3px 6px var(--tw-shadow), 3px -3px 6px var(--tw-shadow), -3px 3px 6px var(--tw-shadow), 3px 3px 6px var(--tw-shadow) 
}
.PForm >>> button span,
.PForm >>> .btn span { text-shadow: none }
</style>
