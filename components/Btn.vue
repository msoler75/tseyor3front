<template>
  <div
    class="btn whitespace-nowrap"
    :class="disabled?'opacity-50 pointer-events-none':''"
    @click="$emit('click', $event)"
  >
  <slot>
    <icon v-if="icon" :icon="icon" class="w-6"/>
    <span>{{ label }}</span>
    </slot>
  </div>
</template>

<script>
export default {
    props: {
        icon: {},
        label: {},
        disabled: {}
    }
}
</script>