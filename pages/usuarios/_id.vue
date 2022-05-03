<template>
  <section class="w-full max-w-lg flex flex-col items-center space-y-4 px-1">

    <NotificationDrafts v-if="soyYo" />

    <Card class="w-full sm:py-5 sm:px-7 text-center">
      <h1 class="!mt-5">{{ usuario.nombreSimbolico || usuario.username }}</h1>

      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>

      <InputImage v-if="soyYo" class="inputimg mb-7" title="Actualizar foto del perfil" :crop="true" :stencil-props="{
        aspectRatio: 1,
        previewClass: 'preview'
      }" stencil-component="circle-stencil" textCrop="Recortar y Guardar" @change="subirImagen" :value="cimage"
        :disabled="subiendoImagen" />

      <blockquote v-if="usuario.frase" class="mt-2">
        <p>{{ nuevaFrase || usuario.frase }}</p>
      </blockquote>

      <button v-if="soyYo" class="btn w-48 mx-auto btn-gray text-sm inline-block mb-7"
        @click="cambiandoFrase = true; nuevaFrase = ''">Cambiar mi frase</button>

      <template v-else>
        <section class="my-5">
          <a class="btn inline-block mx-auto">
            <icon icon="envelope" class="mr-4" />Contactar
          </a>
        </section>
      </template>

      <Modal v-if="soyYo" v-model="cambiandoFrase" title="Mi nueva frase es...">
        <form @submit.prevent="guardarFrase" class="p-7">
          <label for="frase">Nueva frase:</label>
          <br />
          <input id="frase" type="text" maxlength="128" v-model="nuevaFrase" />
          <button class="btn btn-gray text-sm mt-3" :disabled="subiendoFrase">Guardar</button>
        </form>
      </Modal>

      <divider />

      <section>
        <h2>Equipos</h2>
        {{ usuario.equipos }}
        <div class="px-6 pt-4 pb-2 mt-auto">
          <NLink v-for="equipo of usuario.equipos" :key="equipo.id" :to="'/equipos/' + equipo.id"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2">
            {{ equipo.nombre }}</NLink>
        </div>
      </section>

      <section v-if="historial.length">
        <divider />
        <h2>Registro de actividad</h2>
        <div v-for="item of historial" :key="item.id" class="text-left">
          <HistorialItem :data="item" :self="soyYo" />
        </div>
        <button v-if="hayMasHistorial" class="mt-3 btn btn-gray text-xs" @click="cargarMasHistorial"
          :disabled="cargandoHistorial">Ver anteriores...</button>
      </section>
      <divider />

      <section>
        <h2>Últimos Comentarios</h2>
        <div v-if="usuario.comentarios && usuario.comentarios.length" class="w-full space-y-4">
          <div v-for="comentario of usuario.comentarios" :key="comentario.id">
            <Card class="p-2 bg-blue-gray-50 dark:bg-blue-gray-900">
              <NLink :to="linkComentario(comentario)" class="flex items-center">
                <icon class="mr-2" icon="far fa-comment" />
                <div v-html="$teaser(comentario.texto, 96)" />
              </NLink>

              <div class="mt-2 text-right text-xs text-diminished">{{ $dayjs(comentario.published_at).fromNow() }}</div>
            </Card>
          </div>
          <button v-if="hayMasComentarios" class="mt-3 btn btn-gray text-xs" @click="cargarMasComentarios"
            :disabled="cargandoComentarios">Ver anteriores...</button>
        </div>
        <p v-else class="text-center italic mb-9">Todavía no ha hecho ningún comentario</p>
      </section>

    </Card>
  </section>
</template>

<script>
export default {
  async asyncData({ route, $strapi, $error }) {
    try {
      const contenido = await $strapi.getContent(route, {
        populate: '*' // ['role', 'comentarios', 'grupos', 'contacto', 'imagen', 'equipos', 'coordina']
      })
      if (!contenido)
        return $error(404, 'Usuario no encontrado')

      return { contenido, usuario: contenido, historial: [] }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  },

  /*async asyncData({ route, route, $strapi, $error }) {
    const filters = {
      _limit: 10
    }
    try {
      const id = route.params.id;
      const [usuario] = await $strapi.find('users', { id })
      if (!usuario)
        return $error(404, 'Usuario no encontrado')
      const resultado = await $strapi.graphql({
        query: query_historial
          .replace('%start', 0)
          .replace('%limit', filters._limit)
          .replace('%autor', usuario.id)
      })
      usuario.comentarios.splice(10, usuario.comentarios.length)
      return { hayMasComentarios: true, hayMasHistorial: resultado.historials.length === filters._limit, filters, id, usuario, historial: resultado.historials }
    } catch (e) {
      $error(503)
    }
  },*/
  computed: {
    soyYo() {
      if (!this.$strapi.user) return false
      return this.$strapi.user.id === this.usuario.id
    },
    usuarioFrase() {
      console.log('usuarioFrase', this.usuario ? this.usuario.frase : '')
      return this.usuario ? this.usuario.frase : ''
    },
    cimage() {
      return this.usuario && this.usuario.imagen && this.usuario.imagen.url
        ? this.usuario.imagen.url
        : '/imagenes/usuario.jpg'
    }
  },
  data() {
    console.log('data', this.usuarioFrase)
    return {
      hayMasComentarios: false,
      hayMasHistorial: false,
      subiendoImagen: false,
      cambiandoFrase: false,
      subiendoFrase: false,
      cargandoHistorial: false,
      cargandoComentarios: false,
      nuevaFrase: this.usuarioFrase
    }
  },
  watch: {
    usuarioFrase(newValue) {
      console.log('usuarioFrase watch', newValue, this.usuarioFrase)
      this.nuevaFrase = this.usuarioFrase
    }
  },
  methods: {
    cargarMasHistorial() {
      return
      this.cargandoHistorial = true
      this.$strapi.graphql({
        query: query_historial
          .replace('%start', this.historial.length)
          .replace('%limit', this.filters._limit)
          .replace('%autor', this.usuario.id)
      })
        .then((result) => {
          for (const h of result.historials)
            this.historial.push(h)
          this.hayMasHistorial = result.historials.length === this.filters._limit
          this.cargandoHistorial = false
        })
    },
    cargarMasComentarios() {
      return
      this.cargandoComentarios = true
      this.$strapi.find('comentarios', { _start: this.usuario.comentarios.length, _limit: this.filters._limit })
        .then((comentarios) => {
          for (const c of comentarios)
            this.usuario.comentarios.push(c)
          this.hayMasComentarios = comentarios.length === this.filters._limit
          this.cargandoComentarios = false
        })
    },
    linkComentario(comentario) {
      return `${comentario.uid}#comentario-${comentario.id}`
    },
    async guardarFrase() {
      this.subiendoFrase = true
      this.usuario.frase = this.nuevaFrase
      this.$strapi.update('users', this.usuario.id, { frase: this.nuevaFrase }).then(response => {
        this.subiendoFrase = false
        this.cambiandoFrase = false
        // this.fetchUser()
      })
    },
    async subirImagen(payload) {
      console.log('subirImagen', payload)
      const files = payload.files
      if (!files || !files.length) return
      this.subiendoImagen = true
      const form = new FormData()
      form.append("files", files[0])
      const that = this
      this.$strapi.upload(form)
        .then(async (response) => {
          this.subiendoImagen = false
          console.log('response', response)
          if (response[0].id) {
            const user = await this.$strapi.update('users', this.$strapi.user.id, { imagen: response[0].id })
            console.warn('UPDATE USER RESULT', user)
            if (user) {
              this.$strapi.user = user
              this.$set(this.usuario, 'imagen', user.imagen)
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.subiendoImagen = false
        })
    }
  }
}
</script>

<style scoped>
divider {
  @apply my-3;
}

.card>>>h2 {
  @apply text-lg text-center tracking-wide uppercase;
}

.inputimg>>>.preview {
  border: dashed 2px rgba(255, 255, 255, 0.45);
}
</style>