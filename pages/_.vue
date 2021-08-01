<template>
<div>
  <h1>{{pagina.titulo}}</h1>
  {{pagina.texto}}
  </div>  
</template>

<script>
export default {  
  async asyncData({$strapi, route, redirect}) {
    const parts = route.fullPath.split("/")
    const slug = parts.length>1?parts.pop():parts[0]
    const ruta = parts.length>1?"/"+parts.join(""):"/"
    const paginas = await $strapi.find('paginas', {ruta, slug})
    if(!paginas.length)
      return { pagina: {titulo: '404 Página no encontrada', texto:''}}
    else
    return { pagina: paginas[0], ruta, slug }
  }
}

</script>
