<template>
    <form class="regular-form">
        <slot/>
    </form>
</template>

<style scoped>
.regular-form {
    /* https://www.transparenttextures.com/ */
    
}
.regular-form >>> svg {
  fill: currentColor;
  stroke: currentColor;
}
.regular-form >>> h1, 
.regular-form >>> h2, 
.regular-form >>> h3, 
.regular-form >>> span,
.regular-form >>> a,
.regular-form >>> label, 
.regular-form >>> p {
    --tw-shadow: rgba(236, 239, 241, .3);
     text-shadow: 0px 0px 4px var(--tw-shadow), -3px 0 6px var(--tw-shadow), 3px 0 6px var(--tw-shadow), 0 -3px 6px var(--tw-shadow), 0 3px 6px var(--tw-shadow), -3px -3px 6px var(--tw-shadow), 3px -3px 6px var(--tw-shadow), -3px 3px 6px var(--tw-shadow), 3px 3px 6px var(--tw-shadow) 
}
.regular-form >>> button span,
.regular-form >>> .btn span { text-shadow: none }
</style>
