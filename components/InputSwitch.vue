<template>
    <div class="relative inline-block w-10 align-middle select-none flex-shrink-0">
        <input
            type="checkbox"
            v-model="localValue"
            @click="$emit('click')"
            class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-400 appearance-none cursor-pointer transition-all duration-200 ease-in right-4"
        />
        <label
            @click="localValue = !localValue; $emit('click')"
            class="toggle-label block overflow-hidden w-10 h-6 rounded-full bg-gray-400 cursor-pointer transition-all duration-200 ease-in"
        ></label>
    </div>
</template>

<script>
import vmodel from '~/mixins/vmodel.js'
export default {
    mixins: [vmodel],
}
</script>

<style scoped>
input.toggle-checkbox:checked {
    @apply right-0 border-blue-400;
    border-color: #08f;
}
input.toggle-checkbox:checked + .toggle-label {
    @apply: bg-blue-400;
    background-color: #08f;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>