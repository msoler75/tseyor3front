<template>
  <section class="flex justify-center">
    <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>
      {{loggedInUser}}
    cimage: {{cimage}}
      <div v-if="cimage==='/imagenes/usuario.jpg'">
                <input id="imagen" type="file" @change="onFileChange"  />
                <p class="error">{{ errors.imagen }}</p>
            </div>
            <div v-else>
                <img :src="cimage" class="max-w-sm max-h-xs" />
                <div
                    class="btn btn-gray text-xs mt-1"
                    @click.prevent="removeImage"
                >Remover imagen</div>
            </div>

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
export default {
  middleware: "logged",
  computed: {
    ...mapGetters(["loggedInUser"]),
    usuario () {
      return this.loggedInUser
    },
    cimage () {
      return this.usuario && this.usuario.imagen && this.usuario.imagen.url
        ? this.usuario.imagen.url
        : '/imagenes/usuario.jpg'
    }
  },
  data() {
    return {
      errors: {},
    }
  },
  methods: {
      onFileChange(e) {
          var files = e.target.files || e.dataTransfer.files
          if (!files.length) return
          this.createImage(files[0])
      },
     createImage(file) {
       if(!this.usuario) return
          var image = new Image()
          var reader = new FileReader()
          var vm = this

          reader.onload = async e => {

              await vm.$strapi.update('users', this.usuario.id, {imagen: e.target.result} )
                vm.$store.commit(
                "SET_USER",
                await vm.$fetchUser()
                )

          }
          reader.readAsDataURL(file)
      },
     removeImage: async function () {
       if(!this.usuario) return
          await this.$strapi.update('users', this.usuario.id, {imagen: null} )
          this.$store.commit(
          "SET_USER",
          await this.$fetchUser()
        );
      },
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