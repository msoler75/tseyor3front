<template>
  <div class="max-w-full lg:max-w-lg mx-auto flex flex-col items-center text-center">
    <div class="flex items-center space-x-10">
      <h1
        class="text-5xl bg-white text-red w-48 h-24 rounded-full flex justify-center items-center"
      >{{ code }}</h1>
      <h2>{{ message }}</h2>
    </div>
    <nuxt-img src="/imagenes/trabajando.png" />
  </div>
</template>

<script>
export default {
  props: ['error'],
  head() {
    return {
      title: this.cmessage + ' | TSEYOR'
    }
  },
  computed: {
    code() {
      if (!this.error)
        return 500
      return this.error.statusCode || 500
    },
    message() {
      if (!this.error) return 'Error desconocido'
      if (this.error && this.error.message) return this.error.message
      return 'Error no reconocido'
    }
  }
}
</script>