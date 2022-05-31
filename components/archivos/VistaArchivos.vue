<template>
    <div class="w-full h-full"
      :class="cargando?'flex max-h-[70vh] justify-center':''">
        <Loader v-if="cargando"/>
        <slot v-else/>
    </div>
</template>

<script>
export default {
  props: {
    cargando: { type: Boolean, required: true },
  }
}
</script>