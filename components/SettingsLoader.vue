<template>
  <span
    class="
      inline-flex
      justify-center      
      items-center
      cursor-pointer
      text-gray text-xl
      group
      w-[30px]
      h-[30px]
      rounded-full
      hover:bg-gray/10
    "
    :class="
      controls ? 'pointer-events-auto' : 'opacity-0 pointer-events-none'
    "
    @click.stop="$emit('click', $event)"
  >
    <Loader v-if="loader" class="flex flex-shrink-0 self-center" />
    <span
      v-else-if="controls && !loader"
      class="inline-flex justify-center items-center opacity-75 group-hover:opacity-100 w-full"
      :class="vertical?'':'-translate-y-1.5'"
    >
      {{ vertical? "&vellip;" : "&hellip;" }}
    </span>
    <span v-else>&nbsp;</span>
  </span>
</template>

<script>
export default {
  props: {
    vertical: {type: Boolean, required: false, default: true},
    controls: {type: Boolean, required: false, default: true},
    loader: {type: Boolean, required: false, default: false}
  }
}
</script>