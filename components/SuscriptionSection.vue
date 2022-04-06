<template>
  <!-- suscripción -->
  <Section class="w-full py-9 px-1 sm:px-6 md:px-10">
    <div class="max-w-3xl mx-auto flex justify-center items-center sm:justify-between flex-wrap">
      <div class="mx-auto flex flex-col justify-center items-center sm:w-1/2 lg:w-1/3">
        <div class="flex justify-center mb-4">
          <nuxt-link
            :to="`/${collection}`"
            class="max-w-full w-44 h-32 rounded-3xl overflow-hidden"
          >
            <div :style="imageBg" class="w-full h-full block shadow" />
          </nuxt-link>
        </div>
        <h2 class="text-gray-100 text-2xl text-center">{{ title }}</h2>
      </div>
      <div class="sm:w-1/2 lg:w-2/3">
        suscrito: {{ suscrito }}
        <div class="flex flex-col space-y-4 justify-center items-center sm:mx-auto">
          <template v-if="isAuthenticated">
            <div class="text-diminished text-xs">
              <span v-if="suscrito">Pulsa en la campanita para dejar de recibir notificaciones.</span>
              <span v-else>Pulsa en la campanita para recibir las novedades en tu correo.</span>
            </div>
            <button class="btn btn-warning" @click="onclick">
              <icon :icon="icon" class="mr-3" />
              <span v-if="suscrito">Recibes notificaciones</span>
              <span v-else>{{ clabel }}</span>
            </button>
          </template>
          <form v-else-if="!suscrito&&!suscribiendose" @submit.prevent="onclick">
            <input type="email" placeholder="Correo electrónico" required ref="correo"/>
            <input type="submit" value="Suscribirme" />
          </form>
          <div v-else>{{mensajeSuscripcion}}</div>
        </div>
        <div
          class="mt-4 text-center text-gray-400 px-2 xs:px-5 mb-7 sm:mx-6 lg:mx-12 text-diminished"
          v-html="description"
        />
      </div>
    </div>
    {{ suscripcion }}
  </Section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    image: {},
    collection: {},
    contentId: {},
    title: {},
    description: {},
    label: {}
  },
  data() {
    return {
      activated: false,
      generales: ['boletines', 'audios', 'comunicados', 'eventos', 'libros', 'normativas', 'noticias'],
      especificos: ['blogs', 'equipos', 'carpetas', 'comentarios'/*, 'paginas'*/],
      suscripcion: null,
      suscribiendose: false,
      mensajeSuscripcion: ''
    }
    
  },
  async fetch() {
    if (this.isAuthenticated) {
      let [suscripcion] = await this.$strapi.find('suscripciones', { usuario: this.loggedInUser.id })
      if (!suscripcion)
        suscripcion = await this.$strapi.create('suscripciones', { usuario: this.loggedInUser.id })
      if (suscripcion) {
        this.suscripcion = suscripcion
      }
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    cimage() {
      if (!this.image) return ""
      if (typeof this.image === "string")
        return this.image
      return this.image.url
    },
    clabel() {
      return this.label || 'Suscríbete'
    },
    imageBg() {
      const imgUrl = this.$img(this.cimage, { width: 300, format: 'webp', quality: 70 })
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    },
    suscrito() {
      if (!this.suscripcion) return false
      console.warn('suscrito?', this.collection, this.suscripcion)
      if (!(this.collection in this.suscripcion)) {
        console.warn('not in')
        return false
      }
      if (this.esgeneral) {
        console.warn('generales')
        return this.suscripcion[this.collection]
      }
      console.warn('especificos', this.contentId, this.suscripcion[this.collection])
      return !!this.suscripcion[this.collection].find(x => x.id === this.contentId)
    },
    esgeneral() {
      return this.generales.includes(this.collection)
    },
    collecionValida() {
      if (!this.collection || (this.generales.includes(this.collection) && this.especificos.includes(this.collection))) {
        console.warn(this.collection, 'no válida')
        return false
      }
      return true
    },
    icon() {
      // return 'fas fa-' + (this.suscrito ? 'bell' : 'bell-slash')
      return this.suscrito ? 'fas fa-bell' : 'far fa-bell'
    }
  },
  methods: {
    async guardarSuscripcion() {
      this.suscripcion = await this.$strapi.update('suscripciones', this.suscripcion.id, this.suscripcion)
    },
    onclick() {
      if (this.isAuthenticated) {
        if (this.esgeneral) {
          this.suscripcion[this.collection] = !this.suscripcion[this.collection]
        }
        else {
          if (this.suscrito) {
            // eliminamos la suscripción específica
            const idx = this.suscripcion[this.collection].findIndex(x => x.id === this.contentId)
            if (idx > -1) this.suscripcion[this.collection].splice(idx, 1)
          }
          else {
            // añadimos la suscripción específica. Basta poner el id
            this.suscripcion[this.collection].push(this.contentId)
          }
        }
        this.guardarSuscripcion()
      }
      else {
        const correo = this.$refs.correo.value
        this.mensajeSuscripcion = 'Verifica tu buzón de correo'
        this.suscripcion = {}
        this.suscripcion[this.collection] = this.isgeneral?true:[this.contentId]
        //this.suscribiendose = true
        /* if(!this.suscripcion) {
          const params = {}
          if(this.esgeneral) params[this.collection] = true
          else params[this.collection] = [this.contentId]
          this.$strapi.create('suscripciones', { correo: this.$refs.correo.value, ...params })
        .then(response=>{
          this.suscripcion = response
        }) 
          } */
      }
    },
    async suscribe() {
      const correo = route.query.correo
      const secreto = route.query.secreto
      let [suscripcion] = await this.$strapi.find(
        'suscripciones',
        loggedInUser ? { usuario: loggedInUser.id } : { correo, secreto }
      )
    }
  }
}
</script>