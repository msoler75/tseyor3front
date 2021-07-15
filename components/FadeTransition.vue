<template>
  <transition
    enter-active-class="ease-in-out transition duration-300"
    leave-active-class="ease-in-out transition duration-300"
    enter-class="opacity-0"
    leave-to-class="opacity-0"
    v-bind="$attrs"
    v-on="$listeners">
      <slot></slot>
  </transition>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
