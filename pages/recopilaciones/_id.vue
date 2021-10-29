<template>
  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" focused contained="no">

    <NLink
      v-if="isAuthenticated && contenido && loggedInUser.id === contenido.autor.id"
      class="btn absolute top-24 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      :to="`/recopilaciones/editar/${contenido.id}`"
    >
      <icon icon="edit" />
      <span class="ml-2 hidden sm:inline">Editar</span>
    </NLink>

    <!-- article heading -->
    <section class="py-5 px-2 xs:px-4 w-full max-w-md mx-auto bg-gray-50 dark:bg-gray-900 shadow">
      <div class="text-center xs:p-3 sm:p-5">
        <h2>{{ ctitle }}</h2>
        <p>{{ cdescription }}</p>
      </div>
      <div class="max-w-sm mx-auto mt-5 text-center italic font-bold text-lg">
        <p v-if="reciente" class="text-xl text-orange-900">RECIBIENDO RECOPILACIONES</p>
        <p v-else class="text-diminished">{{ hace }}</p>
      </div>
    </section>

    <Card v-if="!escribio" class="my-12 py-5 px-2 xs:px-4 w-full max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">

      <h3 v-if="!escribio" class="text-center">Registro de la experiencia</h3>

      <form @submit.prevent="submit" class="regular-form bg-transparent space-y-9" autocomplete="on">
        <div v-if="!isAuthenticated" class="text-center">¿Ya tienes cuenta? <NLink :to="`/login/?desde=${$route.path}}`">Inicia sesión</NLink></div>
        <div>
          <label v-if="!isAuthenticated" for="nombre">Tu nombre:</label>
          <br v-if="!isAuthenticated" />
          <input type="text" id="nombre" v-model="nombre" :disabled="isAuthenticated" />
          <p class="error">{{ errors.nombre }}</p>
        </div>
        <div v-if="!isAuthenticated">
          <label for="nombre">Tu correo electrónico:</label>
          <br />
          <input type="email" id="nombre" v-model="correo" required :disabled="isAuthenticated" autocomplete="email"/>
          <p class="error">{{ errors.correo }}</p>
        </div>
        <div>
          <label for="texto">Descripción de la Experiencia:</label>
          <br />
          <textarea id="texto" rows="7" v-model="experiencia" required />
          <p class="error">{{ errors.texto }}</p>
        </div>

        <div class="flex justify-center">
          <button class="btn w-full text-center" type="submit" :disabled="enviando">
            <icon class="!w-6" :icon="enviando ? 'sync spin' : 'paper-plane'" />
            <span class="inline-block w-28">{{ enviando ? 'Enviando' : 'Enviar' }}</span>
          </button>
        </div>
      </form>      
    </Card>

    <div v-if="experiencias.length" class="flex w-full max-w-md mx-auto justify-center items-center space-x-4 bg-blue-gray-100 dark:bg-gray-800 shadow p-5">

      <div
        v-if="experiencias.length"
        class="btn btn-gray"
        v-scroll-to="`#comentario-${experiencias[0].id}`"
      >
      <icon icon="eye" class="mr-2"/> 
      Ver mi experiencia</div>      
    
    </div>

    <template v-if="escribio||esAutor">

    <section class="">

      <!-- share modal -->
      <Comparte v-model="viendoCompartir" />

      <SocialButtons
        id="social"
        :data="contenido"
        @like="like(contenido.id)"
        @dislike="dislike(contenido.id)"
        @share="viendoCompartir = true"
        class="mx-auto max-w-xl my-7 lg:my-16"
        :commentLabels="['Escribe', ' Experiencia', ' Experiencias']"
        :showWhoLiked="dias>=2"
      />

  </section>

  <section class="w-full border-t border-gray bg-gray-100 dark:bg-gray-900">

      <!-- comentarios -->
      <div id="comentarios" class="container mx-auto my-9">
        <h3 v-if="contenido.comentarios" class="text-center">
          {{
            contenido.comentarios +
              " Experiencia" +
              (contenido.comentarios !== 1 ? "s" : "")
          }}
        </h3>
        <h3 v-else class="text-center">Escribe tu experiencia</h3>
        <Comentarios
          placeholder="Escribe tu experiencia..."
          buttonLabel="Enviar"
          :uid="uid"
          :content-title="ctitle"
          :reload="recargar"
          @count="$set(contenido, 'comentarios', $event)"
          class="px-1 xs:px-2"
          @commented="recargarExperiencias();escribio=true"
        />
      </div>

  <section v-if="contenido.comentarios" class="my-9 max-w-[16rem] mx-auto text-center">
      <div class="btn btn-warning w-auto"><icon icon="file-alt" class="mr-2"/> Exportar experiencias</div>
  </section>

      </section>



    </template>
  </div>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from "@/mixins/seo.js";
import { mapGetters } from "vuex";
import validation from "@/mixins/validation"
export default {
  mixins: [vercontenidomixin, seo, validation],
  async asyncData({ $strapi, store, route, $error }) {
    try {
      const id = route.params.id;
      const contenido = await $strapi.findOne("recopilaciones", id)
      if (!contenido)
        return $error(404, 'Recopilación no encontrada')
      contenido.likes = await $strapi.find("likes", {
        uid: `/recopilaciones/${contenido.id}`
      })
      let escribio = false
      const user = store.getters.loggedInUser
      let experiencias = []
      if (user && user.id) {
        // escribió ya algun comentario este usuario?
        experiencias = await $strapi.find('comentarios', { uid: `/recopilaciones/${contenido.id}`, 'autor.id': user.id })
        escribio = experiencias.length > 0
      }
      return { escribio, experiencias, contenido, recopilacion: contenido }
    } catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      nombre: "",
      correo: "",
      experiencia: "",
      errors: {},
      enviando: false,
      recargar: 0
    }
  },
  mounted() {
    this.nombre = this.isAuthenticated ? this.loggedInUser.nombreSimbolico : ''
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    dias() {
      return this.$dayjs().diff(this.contenido.created_at, 'day') 
    },
    reciente() {
      return this.contenido ? this.dias < 1 : false
    },
    hace() {
      if (this.dias > 2)
        return this.$dayjs(this.contenido.created_at).fromNow()
      return 'Hace unas horas'
    },
    esAutor() {
      return this.isAuthenticated && this.contenido.autor.id === this.loggedInUser.id
    }
  },
  methods: {
    async recargarExperiencias() {
      this.$set(this, 'experiencias', 
            await this.$strapi.find('comentarios', 
            { 
              uid: `/recopilaciones/${this.contenido.id}`, 
              'autor.id': this.loggedInUser.id 
            }))
    },
    async submit() {
      this.enviando = true
      await this.$strapi.create('comentarios', {
        uid: this.uid,
        nombre: this.nombre ? this.nombre : null,
        correo: this.correo ? this.correo : null,
        texto: this.experiencia
      })
         .then(async comentario => {
          if(this.loggedInUser)
            this.recargarExperiencias()

            this.recargar++
          // registro de actividad
          this.$strapi.create('historials', {
            accion: 'experiencia_compartida',
            titulo: this.ctitle,
            url: this.uid + '#comentario-'+comentario.id
          })
          this.escribio = true
          this.enviando = false
        }) 
        .catch(err=>{
          this.enviando = false
          this.setErr(err)
        })
    }
  }
};
</script>

<style scoped>
@import "@/assets/css/form.css";
</style>