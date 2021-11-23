<template>
  <div>
    <Card class="p-1 sm:p-5 md:p-9">
      <h1>{{ carpetaActual.nombreOriginal || carpetaActual.nombre }}</h1>
      <FilesFolder
        v-if="carpetaRaiz"
        v-model="carpetaActualId"
        class="w-full h-full overflow-y-auto"
        @click="clickHandler"
        :navigationMode="navigationMode"
        @navigated="navegacion"
        @loaded="loaded"
      />
    </Card>
    <div class="flex">
    <InputFiles
            :multiple="true"
            @change="onUpload"
            class="ml-auto mt-5"
            textButton="Añadir Archivos"
        />
    </div>
  </div>
</template>

<script>
// poner a Main para activar turbo navegación o false para navegación solo con $router
const NAVIGATION_MODE = 'Main'

import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  middleware: 'archivos',
  async asyncData({ route, $strapi, $error, $config }) {
    try {
      console.log('fullPath:', route.fullPath)
      const parts = route.fullPath.replace(/\?.*$/, '').split("/").filter(x => !!x)
      console.log('parts:', parts)
      // parts.shift()
      const ruta = parts.length > 0 ? "/" + parts.join("/") : "/"
      console.log('ruta:', ruta)
      const [carpetaActual] = await $strapi.find('carpetas', { ruta })
      console.log('carpetaActual', carpetaActual)
      if (!carpetaActual)
        return $error(404)
      let carpetaRaiz
      if (ruta !== $config.archivosRuta)
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
      carpetaActualId: null,
      navigationMode: NAVIGATION_MODE
    }
  },
  mounted() {
    console.log('nuxt-child.mounted!')
    this.carpetaActualId = this.carpetaActual ? this.carpetaActual.id : this.carpetaActualId
    console.log('***child.mounted.updateBreadcrumb')
    this.updateBreadcrumb()
    if (NAVIGATION_MODE === 'Main') {

      window.onpopstate = this.onchangeurl



      // event fire when pushState
      this.$nuxt.$on('pushState', params => {
        // do your logic with params
        console.log('pushState', params)
      })

      // event fire when pushState
      this.$nuxt.$on('popState', params => {
        // do your logic with params
        console.log('popState', params)
      })
    }
  },
  beforeUnmount() {
    // window.removeEventListener('popstate', this.onchangeurl)

    /*    this.$nuxt.$off('pushState')
    this.$nuxt.$off('popState') */
  },
  methods: {
    loaded(carpeta) {
      console.log('_ loaded!!!')
      this.$store.commit('travelling', false)
      this.$store.dispatch('beforeEnter', this.$el)

      // this.carpetaActualId = this.carpetaActual?this.carpetaActual.id:this.carpetaActualId
      this.carpetaActual = carpeta
      console.log('***child.loaded.updateBreadcrumb')
      this.updateBreadcrumb()
    },
    // este método se activa cuando la navegación main está activada
    navegacion(carpeta) {
      console.log('navigated to', carpeta)
      if (!carpeta) return
      if (carpeta.id === this.carpetaActual.id) return
      this.carpetaActual = carpeta
      window.event.preventDefault()
      return false
      // Where there are history.pushState
      // this.$nuxt.$emit('pushState', params)
    },
    // en cambio esta se activa cuando hay un 'click' en una carpeta
    clickHandler(carpeta) {
      if (!carpeta) return
      if (carpeta.id === this.carpetaActual.id) return
      this.$router.push(carpeta.ruta)
    },
    updateBreadcrumb() {
      console.log('archivos.updateBreadcrumb()')
      const carpeta = this.carpetaActual
      const rootData = this.$store.getters.getRouteData(this.$config.archivosRuta)
      const breadcrumb = []
      const parts = carpeta.ruta.split("/").filter(x => !!x)
      // parts.shift()
      let rutaParcial = ''
      const that = this
      while (parts.length) {
        const part = parts.shift()
        rutaParcial += '/' + part
        const ruta = rutaParcial
        // const base = ruta===this.$config.archivosRuta?this.$store.getters.getRouteData(ruta):{}
        breadcrumb.push({
          name: part,
          href: rutaParcial,
          click: this.navigationMode === 'Main' ? async (event) => {
            console.log('clicked!', event, ruta)
            event.preventDefault()
            event.stopPropagation();
            const [carpeta] = await this.$strapi.find('carpetas', { ruta })
            console.log('carpeta', carpeta)
            console.log('current carpetaId', that.carpetaActualId)
            if (carpeta)
              that.carpetaActualId = carpeta.id
            history.pushState({}, null, carpeta.ruta)
            // that.updateBreadcrumb()
            return false
          } : null,
          icon: rootData.icon
        })
      }

      this.$store.commit('setNextPathBreadcrumb', breadcrumb)
      this.$store.commit('updateBreadcrumb')
    },
  onchangeurl(event) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    console.log('popstate!', event, location.pathname)
    /* if(location.pathname!==this.carpetaActual.ruta) {
      const carpetas = this.$strapi.find('carpetas', {ruta: newValue})
      const carpeta = carpetas[0]
      console.log('carpeta con ruta', newValue, carpeta)
      if(carpeta)
        this.$set(this, 'carpeta', carpeta)
    } */
  },
   onUpload(payload) {
     console.log('onUpload', payload)
    },
  },
  computed: {
    carpetaActualJSON() {
      return JSON.stringify(this.carpetaActual)
    },
    rutaActual() {
      return this.$route.fullPath
    }
  },
  watch: {
    carpetaActualJSON(newValue) {
      console.log('***child.watched.carpetaActual.updateBreadcrumb')
      this.updateBreadcrumb()
    },
    rutaActual(newValue) {
      console.log('!watched rutaActual')
      /*
      this.$nextTick(()=>{
        this.$store.commit('travelling', false)
        this.$store.dispatch('beforeEnter', this.$el)
        this.carpetaActualId = this.carpetaActual?this.carpetaActual.id:this.carpetaActualId
        this.updateBreadcrumb()
      })
      */
    }
  }
}
</script>
