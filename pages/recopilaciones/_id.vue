<template>
  <!-- Sin padding -->
  <!-- No tiene imagen de fondo -->
  <div class="flex flex-col items-center" focused contained="no">

    <NLink
      v-if="isAuthenticated && loggedInUser.id === contenido.autor.id"
      class="btn absolute top-24 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      :to="`/recopilaciones/editar/${contenido.id}`"
    >
      <icon icon="edit" />
      <span class="ml-2 hidden sm:inline">Editar</span>
    </NLink>


    <h1 v-if="!escribio">Recopilación de experiencias</h1>

    <!-- article heading -->
    <Card class="py-5 px-2 xs:px-4 w-full max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">
      <div class="text-center xs:p-3 sm:p-5">
        <h2>{{ ctitle }}</h2>
        <p>{{ cdescription }}</p>
      </div>
      <div class="mt-5 text-center italic">
        <p v-if="!reciente" class="text-orange-900 font-bold">EXPERIENCIA EN CURSO</p>
        <p v-else>{{ hace }}</p>
      </div>


      <form v-if="!escribio" @submit.prevent="submit" class="regular-form bg-transparent space-y-9" autocomplete="on">
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
      <p v-else-if="experiencias.length" class="my-12 flex justify-center">
        <button
          class="btn btn-gray"
          v-scroll-to="`#comentario-${experiencias[0].id}`"
        >Ver mi experiencia</button>
      </p>
    </Card>

    <template v-if="escribio||esAutor">

      <section class="my-9">
        <div class="btn btn-warning"><icon icon="file-pdf" class="mr-2"/> Exportar experiencias en PDF</div>
      </section>

    <section class="w-full border-t border-gray bg-blue-50 dark:bg-blue-gray-900">

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
      />

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
        />
      </div>
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
        return this.$dayjs(contenido.created_at).fromNow()
      return 'Hace unas horas'
    },
    esAutor() {
      return this.isAuthenticated && this.contenido.autor.id === this.loggedInUser.id
    }
  },
  methods: {
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
            this.$set(this, 'experiencias', 
            await this.$strapi.find('comentarios', 
            { 
              uid: `/recopilaciones/${this.contenido.id}`, 
              'autor.id': this.loggedInUser.id 
            }))

            this.recargar++
          // registro de actividad
          this.$strapi.create('historials', {
            accion: 'experiencia_compartida',
            titulo: this.ctitle,
            url: this.uid
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