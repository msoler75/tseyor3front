<template>
    <section class="flex justify-center">
        <div v-if="localValue">
            <span>Cargando...</span>
        </div>
        <div v-else>
            <button @click="$emit('click')" class="btn">Cargar Más...</button>
        </div>
    </section>
</template>

<script>
import vmodel from '@/mixins/vmodel'
export default {
    mixins: [vmodel]
}
</script>