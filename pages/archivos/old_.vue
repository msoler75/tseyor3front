<template>
  <div>
    <Card class="p-1 sm:p-5 md:p-9">
      <Archivos
        v-if="carpetaRaiz"
        v-model="carpetaActualId"
        class="w-full h-full overflow-y-auto"
        @click="clickHandler"
        :modoNavegacion="modoNavegacion"
        @navigated="navegacion"
        @loaded="loaded"
        :refresh="refresh"
        :mostrarUploader="true"
        :mostrarFecha="true"
        :mostrarTamano="true"
        :mostrarDescripcion="true"
        :mostrarControles="true"
      />
    </Card>
    <FolderProps v-model="nuevaCarpeta" :showIt="verModalCarpeta" @accept="crearCarpeta" @close="verModalCarpeta=false" textAccept="Crear carpeta"/>
    <div class="mt-5"
    v-if="tengoPermiso(carpetaActual, 'creacion')||tengoPermiso(carpetaActual, 'administracion')"
    >
      <progress v-if="uploading" max="100" :value="currentProgress" class="w-full h-8 rounded" />
      <div v-else class="flex space-x-4 items-center justify-end">
        <div class="btn btn-gray text-sm" @click="verModalCarpeta=true">
          <icon icon="folder-plus" class="mr-2" />Crear carpeta
        </div>
        <InputFiles
          :multiple="true"
          @change="onUpload"
          textButton="Añadir Archivos"
        />
      </div>
    </div>
  </div>
</template>

<script>
// poner a Main para activar turbo navegación o false para navegación solo con $router
const NAVIGATION_MODE = 'Main'

import seo from '@/mixins/seo'
import permisos from '@/mixins/permisos'
export default {
  mixins: [seo, permisos],
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
      modoNavegacion: NAVIGATION_MODE,
      refresh: 1,
      uploading: false,
      currentProgress: 0,
      verModalCarpeta: false,
      nuevaCarpeta: {nombre:'', autor: {id:null}, permisos:{}}
    }
  },
  mounted() {
    // para que la nueva carpeta proporcione los permisos de autor al usuario actual
      this.resetNuevaCarpeta()
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
          click: this.modoNavegacion === 'Main' ? async (event) => {
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
    onProgress(progress) {
      console.log('progress', progress)
      this.currentProgress = Math.round((progress.loaded / progress.total) * 100);
    },
    onUpload(files) {
      console.log('onUpload', files)
      this.uploading = true
      this.currentProgress = 0
      const form = new FormData()
      for (const file of files)
        form.append("files", file)
      const token = this.$strapi.getToken()
      this.$axios.$post(
        '/api/upload',
        form, // <-- this formData has a big file attachment
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (progress) => this.onProgress(progress) // <-- this updates the progress bar
        })

        //this.$strapi.create("upload", form)
        .then(async (response) => {
          console.log('uploaded!')
          console.log(response)
          for (const result of response) {
            console.log(result)
            console.log('crearemos archivos en la carpeta', this.carpetaActualId)
            await this.$strapi.create("archivos", { carpeta: this.carpetaActualId, nombre: result.name, media: result.id })
              .catch(err => {
                console.warn(err)
              })
          }
          this.refresh++
          // alert('archivos cargados')
          this.currentProgress = 100
          this.uploading = false
        })
        .catch(err => {
          console.warn(err)
        })
    },
    resetNuevaCarpeta() {
      this.nuevaCarpeta = {nombre:'', autor: {id:null}, permisos:{}}
      if(this.$strapi.user)
        this.nuevaCarpeta.autor.id = this.$strapi.user.id
      this.nuevaCarpeta.padre = this.carpetaActualId  
    },
    crearCarpeta() {
      /// this.nuevaCarpeta
      this.$strapi.create("carpetas", this.nuevaCarpeta)
      .then(response=>{
        this.refresh++
        this.resetNuevaCarpeta()
      })
      .catch(error=>{
        console.warn(JSON.stringify(error))
                    let msg = 'Error al guardar'
                    switch (error.statusCode) {
                        case 403: msg = 'No tienes permisos'
                    }
                    this.$toast.error(msg, {
                        position: "bottom-left",
                        timeout: 5000,
                        closeOnClick: true,
                        pauseOnFocusLoss: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: false,
                        hideProgressBar: true,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                    });
      })
    }
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
      this.nuevaCarpeta.padre = this.carpetaActualId
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
