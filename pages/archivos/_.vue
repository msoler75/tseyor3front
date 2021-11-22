<template>
  <div class="container w-96 mx-auto">
    <h1>{{ carpetaActual.nombre }}</h1>
    {{carpetaActualId}}
    <FolderBrowser v-if="carpetaRaiz"
      v-model="carpetaActualId"
      class="w-full h-full overflow-y-auto"
      @click="cambioCarpeta"
    />
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error, $config }) {
    try {
      console.log('fullPath:', route.fullPath)
      const parts = route.fullPath.split("/").filter(x => !!x)
      console.log('parts:', parts)
      // parts.shift()
      const ruta = parts.length > 0 ? "/" + parts.join("/") : "/"
      console.log('ruta:', ruta)
      const [carpetaActual] = await $strapi.find('carpetas', { ruta })
      console.log('carpetaActual', carpetaActual)
      if (!carpetaActual)
        return $error(404)
      let carpetaRaiz
      if(ruta !== $config.archivosRuta)
        [carpetaRaiz] = await $strapi.find('carpetas', { ruta: $config.archivosRuta })
      if (!carpetaRaiz)
        carpetaRaiz = carpetaActual
      return { carpetaRaiz, carpetaActual, contenido: carpetaActual }
    }
    catch (e) {
      console.warn(e)
      if (e.statusCode)
        $error(e.statusCode)
      else
        $error(503)
    }
  },
  data() {
    return {
      carpetaActualId: null
    }
  },
  mounted() {
    // window.addEventListener('onpopstate', this.onchangeurl);
    this.updateBreadcrumb()
    this.carpetaActualId = this.carpetaActual.id
  },
  // beforeUnmount() {
  // window.removeEventListener('onpopstate', this.onchangeurl);
  // },
  methods: {
    cambioCarpeta(carpeta) {
      if (!carpeta) return
      if (carpeta.id === this.carpetaActual.id) return
      this.$router.push(carpeta.ruta)
    },
    updateBreadcrumb() {
      const carpeta = this.carpetaActual
      const breadcrumb = [{ ... this.$store.getters.getRouteData('/archivos') }]
      const parts = carpeta.ruta.split("/").filter(x => !!x)
      parts.shift()
      let rutaParcial = '/archivos'
      while (parts.length) {
        const part = parts.shift()
        rutaParcial += '/' + part
        const ruta = rutaParcial
        breadcrumb.push({
          name: part,
          href: rutaParcial,
          click: async (event) => {
            console.log('clicked!', event, ruta)
            event.preventDefault()
            const [carpeta] = await this.$strapi.find('carpetas', { ruta })
            console.log('carpeta', carpeta)
            if (carpeta) {
              for (const k in carpeta)
                this.$set(this.carpetaActual, k, carpeta[k])
            }
          },
          icon: breadcrumb[0].icon
        })
      }
      this.$store.commit('updateBreadcrumb', breadcrumb)
    },
  },
  /* onchangeurl (event) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    console.log('popstate', location.pathname)
    if(location.pathname!==this.carpetaActual.ruta) {
      const carpetas = this.$strapi.find('carpetas', {ruta: newValue})
      const carpeta = carpetas[0]
      console.log('carpeta con ruta', newValue, carpeta)
      if(carpeta)
        this.$set(this, 'carpeta', carpeta)
    }
  } */
}
</script>
