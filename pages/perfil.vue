<template>
  <section class="flex justify-center">
    <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>
      
     <InputImage 
        title="Actualizar foto del perfil" 
        :stencil="{ aspectRatio: 1 / 1 }"
        :crop="true" 
        textCrop="Recortar y Guardar"
        @change="subirImagen"
      />
 
      <h1>{{ usuario.nombreSimbolico || usuario.username }}</h1>

      <blockquote v-if="usuario.frase" class="mt-2 mb-4">
        <p>{{ usuario.frase }}</p>
      </blockquote>

      <divider />
      <section class="mb-9">
        <a class="btn inline-block mx-auto" icon="fas fa-mail">Contactar</a>
      </section>
    </Card>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
export default {
  middleware: "logged",
  components: {
    Cropper,
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    usuario() {
      return this.loggedInUser
    },
    cimage() {
      return this.usuario && this.usuario.imagen && this.usuario.imagen.url
        ? this.usuario.imagen.url
        : '/imagenes/usuario.jpg'
    }
  },
  methods: {
    async subirImagen(payload) {
      console.log('subirImagen', payload)
      const file = payload.file || payload
      if(!file) return
      const form = new FormData()
      form.append("files", file)
      await this.$strapi.create("upload", form)
        .then(async (response) => {
          console.log('response', response)
          /* if (response[0].url) {
          await this.$strapi.update('users', this.usuario.id, { imagen: response[0].url })
          this.$store.commit(
            "SET_USER",
            await this.$fetchUser()
          )
        }*/
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

</style>