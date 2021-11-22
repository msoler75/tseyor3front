<template>
  <div>
    <h1>{{ pagina.titulo }}</h1>
    {{ pagina.texto }}
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  async asyncData({ $strapi, route, router, $error }) {
    try {
      if(route.fullPath === '/archivos')
        return router.push('/archivos/')
      const parts = route.fullPath.split("/")
      const slug = parts.length > 1 ? parts.pop() : parts[0]
      const ruta = parts.length > 1 ? "/" + parts.join("") : "/"
      const paginas = await $strapi.find('paginas', { ruta, slug })
      if (!paginas.length)
        $error(404)
      else
        return { pagina: paginas[0], ruta, slug }
    } catch (e) {
      $error(503)
    }
  }
}

</script>
