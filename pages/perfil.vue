<template>
  <section class="flex justify-center">
    <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <h1 class="!mt-5">{{ usuario.nombreSimbolico || usuario.username }}</h1>

      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>

      <InputImage
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

      <button class="btn w-48 mx-auto btn-gray text-sm inline-block mb-7" @click="cambiandoFrase=true;nuevaFrase=''">Cambiar mi frase</button>
    
    <Modal v-model="cambiandoFrase" title="Mi nueva frase es...">
      <form @submit.prevent="guardarFrase" class="p-7">
        <label for="frase">Nueva frase:</label><br />
        <input id="frase" type="text" maxlength="128" v-model="nuevaFrase"/>
        <button class="btn btn-gray text-sm mt-3" :disabled="subiendoFrase">Guardar</button>
      </form>
    </Modal>

    </Card>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  middleware: "logged",
  computed: {
    ...mapGetters(["loggedInUser"]),
    usuario() {
      console.log('usuario', this.loggedInUser)
      return this.loggedInUser
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
    async fetchUser(){
      this.$store.commit(
              "SET_USER",
              await this.$fetchUser()
            )
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