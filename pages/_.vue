<template>
  <div>
    <h1>{{ pagina.titulo }}</h1>
    {{ pagina.texto }}
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  async asyncData({ route, $strapi, $error }) {
    try {
      if (route.fullPath === '/archivos')
        return router.push('/archivos/')
      const parts = route.fullPath.split("/")
      const ruta = parts.length > 1 ? "/" + parts.join("") : "/"
      const { data: [pagina], error } = await $strapi.find('paginas', {
        populate: '*',
        filters: {
          ruta: {
            $eq: ruta
          }
        }
      })
      if (!pagina)
        return $error(error && error.status ? error.status : 503)
      return { pagina, ruta }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  }
}

</script>
