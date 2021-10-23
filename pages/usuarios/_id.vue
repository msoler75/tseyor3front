<template>
  <section class="flex justify-center">
    <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <h1 class="!mt-5">{{ usuario.nombreSimbolico || usuario.username }}</h1>

      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>

      <InputImage
        v-if="soyYo"
        class="inputimg mb-7"
        title="Actualizar foto del perfil"
        :crop="true"
        :stencil-props="{
          aspectRatio: 1,
          previewClass: 'preview'
        }"
        stencil-component="circle-stencil"
        textCrop="Recortar y Guardar"
        @change="subirImagen"
        :value="usuario.imagen.url"
        :disabled="subiendoImagen"
      />

      <blockquote v-if="usuario.frase" class="mt-2">
        <p>{{ usuario.frase }}</p>
      </blockquote>

      <button v-if="soyYo" class="btn w-48 mx-auto btn-gray text-sm inline-block mb-7" @click="cambiandoFrase=true;nuevaFrase=''">Cambiar mi frase</button>
    
    <Modal v-if="soyYo" v-model="cambiandoFrase" title="Mi nueva frase es...">
      <form @submit.prevent="guardarFrase" class="p-7">
        <label for="frase">Nueva frase:</label><br />
        <input id="frase" type="text" maxlength="128" v-model="nuevaFrase"/>
        <button class="btn btn-gray text-sm mt-3" :disabled="subiendoFrase">Guardar</button>
      </form>
    </Modal>


    <divider />

      <section>
        <h2>Equipos</h2>
        <div class="px-6 pt-4 pb-2 mt-auto">
          <NLink
            v-for="equipo of usuario.equipos"
            :key="equipo.id"
            :to="'/equipos/' + equipo.id"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >{{ equipo.nombre }}</NLink>
        </div>
      </section>
      <divider />

      <section>
        <h2>Últimos Comentarios</h2>
        <div v-if="usuario.comentarios && usuario.comentarios.length" class="w-full space-y-4">
          <div v-for="comentario of usuario.comentarios" :key="comentario.id">
            <Card class="p-2 bg-blue-gray-50 dark:bg-blue-gray-900">
              <NLink :to="contenidoref(comentario)" class="flex items-center">
                <icon class="mr-2" icon="far fa-comment" />
                <div v-html="$teaser(comentario.texto, 96)" />
              </NLink>

              <div
                class="mt-2 text-right text-xs text-diminished"
              >{{ $dayjs(comentario.published_at).fromNow() }}</div>
            </Card>
          </div>
        </div>
        <p v-else class="text-center italic">No hay comentarios</p>
      </section>

      <divider />
      <section class="mb-9">
        <a class="btn inline-block mx-auto" icon="fas fa-mail">Contactar</a>
      </section>

    </Card>



    
  </section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
   async asyncData({ route, $strapi, $error }) {
    try {
      const id = route.params.id;
      const usuarios = await $strapi.find('users', { id })
      if(!usuarios.length)
        return $error(404, 'Usuario no encontrado')
      const usuario = usuarios[0]
      return { id, usuario }
    } catch (e) {
      $error(503)
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    soyYo() {
      if(!this.isAuthenticated) return false
      return this.loggedInUser.id===this.usuario.id
    },
    usuarioFrase(){
      console.log('usuarioFrase', this.usuario?this.usuario.frase:'')
      return this.usuario?this.usuario.frase:''
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
      subiendoImagen: false,
      cambiandoFrase: false,
      subiendoFrase: false,
      nuevaFrase: this.usuarioFrase
    }
  },
  watch: {
    usuarioFrase(newValue) {
      console.log('usuarioFrase watch', newValue, this.usuarioFrase)
      this.nuevaFrase=this.usuarioFrase
    }
  },
  methods: {
    contenidoref(comentario) {
      return '/' + comentario.uid.replace('-', '/') + '#comentarios'
    },
    async fetchUser(){
      await this.$store.commit(
              "SET_USER",
              await this.$fetchUser()
            )
      const usuarios = await this.$strapi.find('users', { id: this.id })
      if(usuarios.length)
        this.usuario = usuarios[0]
    },
    async guardarFrase() {
       this.subiendoFrase = true
       this.$strapi.update('users', this.usuario.id, { frase: this.nuevaFrase }).then(response=>{
         this.subiendoFrase = false
         this.cambiandoFrase = false
         this.fetchUser()
       })
    },
    async subirImagen(payload) {
      console.log('subirImagen', payload)
      const file = payload.file || payload
      if (!file) return
      this.subiendoImagen = true
      const form = new FormData()
      const that = this
      form.append("files", file)
      this.$strapi.create("upload", form)
        .then(async (response) => {
          console.log('response', response)
          if (response[0].id) {
            await this.$strapi.update('users', this.usuario.id, { imagen: response[0].id })
            await this.fetchUser()
            setTimeout(function(){that.subiendoImagen = false},500)
          }
          else
            this.subiendoImagen = false
        })
        .catch(err=>{
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
.card >>> h2 {
  @apply text-lg text-center tracking-wide uppercase;
}

.inputimg >>> .preview {
  border: dashed 2px rgba(255, 255, 255, 0.45);
}
</style>