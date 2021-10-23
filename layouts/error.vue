<template>
  <div class="max-w-full lg:max-w-lg mx-auto flex flex-col items-center text-center">
    <div class="flex items-center space-x-10">
      <h1
        class="text-5xl bg-white text-red w-48 h-24 rounded-full flex justify-center items-center"
      >{{ code }}</h1>
      <h2>{{ message }}</h2>
    </div>
    <nuxt-img :src="'/imagenes/' + image" />
  </div>
</template>

<script>
export default {
  props: ['error'],
  head() {
    return {
      title: this.message + ' | TSEYOR'
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
      switch (this.code) {
        case 400:
          return 'No se pudo interpretar la solicitud'
        case 401:
          return 'Requiere autenticación'
        case 403:
          return 'Acceso denegado'
        case 404:
          return 'Página no encontrada'
        case 405:
          return 'Método no permitido'
        case 406:
          return 'No se encontró contenido apropiado'
        case 408:
          return 'El tiempo de espera de respuesta caducó'
        case 415:
          return 'Tipo de multimedia no soportado'
        case 429:
          return 'Demasiadas solicitudes'
        case 431:
          return 'Campos de encabezado demasiado largos'
        case 503:
          return 'Servicio no disponible temporalmente'
        case 500:
          return 'Error interno'
        case 501:
          return 'No implementado'
        case 502:
          return 'Bad Gateway'
        case 504:
          return 'No se pudo obtener respuesta'
        case 505:
          return 'Versión HTTP no soportada'
      }
      return 'Error no reconocido'
    },
    image() {
      switch (this.code) {
        case 503: return 'escenario-noche.png'
        default:
          return 'trabajando.png'
      }
    }
  }
}
</script>