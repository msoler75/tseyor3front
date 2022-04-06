<template>
    <button
        type="submit"
        :disabled="localValue"
        class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
        <div v-if="localValue" class="flex items-center justify-center">
            <icon icon="sync spin" />
            <span>&nbsp;</span>
        </div>
        <span v-else>
            <slot>Enviar</slot>
        </span>
    </button>
</template>

<script>
import vmodel from '~/mixins/vmodel.js'
export default {
    mixins: [vmodel],
}
</script>
