<template>
    <div class="max-w-xl mx-auto"
    :class="$device.isMobileOrTablet?'touch':'mouse'">
        <div v-for="comentario of comentariosListado" :key="comentario.id" class="comment flex flex-col mb-5">
            <div class="flex w-full">
                <Avatar :data="comentario.user" class="text-3xl w-8 h-8 sm:w-16 sm:h-16 mr-2 sm:mr-3 lg:mr-5"/>
                <section>
                  <Card class="w-full p-1 xs:p-2 sm:p-4">
                    <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                        <NLink v-if="comentario.user.id" :to="'/usuarios/'+comentario.user.id" class="font-bold mb-1">{{comentario.user.nombreSimbolico||comentario.user.username}}</NLink> 
                        <span v-else class="font-bold">{{comentario.user.nombreSimbolico||comentario.user.username}}</span> 
                        <span class="mx-2 opacity-50">•</span>
                        <span class="text-xs">{{ $dayjs(comentario.updated_at).fromNow() }}</span>
                    </div>
                    <div class="text-justify text-sm lg:text-base" v-html="$renderMarkdownServer(comentario.texto)"/>
                  </Card>
                  
                  <div class="actions mt-2 flex justify-start items-center text-xs px-2">
                    <icon icon="far fa-heart" class="cursor-pointer mr-5"/>
                    <span class="link cursor-pointer" @click="onResponder(comentario.id)">Responder</span>
                  </div>
                
                <!-- respuestas -->
                <div v-if="comentario.respuestas.length" class="w-full mt-5">
                  <div v-for="respuesta of comentario.respuestas" :key="respuesta.id" class="comment flex flex-col mb-5">
                    <div class="flex w-full">
                    <Avatar :data="respuesta.user" class="text-3xl w-8 h-8 mr-2 sm:mr-3 lg:mr-5"/>
                    <section>
                      <Card class="w-full p-1 xs:p-2 sm:p-4">
                        <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                            <NLink v-if="respuesta.user.id" :to="'/usuarios/'+respuesta.user.id" class="font-bold mb-1">{{respuesta.user.nombreSimbolico||respuesta.user.username}}</NLink> 
                            <span v-else class="font-bold">{{respuesta.user.nombre}}</span> 
                            <span class="mx-2 opacity-50">•</span>
                            <span class="text-xs">{{ $dayjs(respuesta.updated_at).fromNow() }}</span>
                        </div>
                        <div class="text-justify text-sm lg:text-base" v-html="$renderMarkdownServer(respuesta.texto)"/>
                      </Card>
                      <div class="actions mt-2 flex justify-start items-center text-xs px-2">
                        <icon icon="far fa-heart" class="cursor-pointer mr-5"/>
                        <span class="link cursor-pointer" @click="onResponder(comentario.id)">Responder</span>
                      </div>
                    </section>
                    </div>
                  </div>
                </div>

                  <Card :id="'respuesta-a-'+comentario.id" class="p-5" v-if="responderA===comentario.id">
                    <form @submit.prevent="responder(comentario.id)">
                      <input type="text" v-model="respuesta" placeholder="Comentario...">
                      <button type="submit" class="btn mt-3">Responder</button>
                    </form>
                  </Card> 

                </section>

            </div>
        </div>

        <Card class="p-5">
          <form @submit.prevent="comentar">
            <input type="text" v-model="nuevoComentario" placeholder="Comentario...">
            <button type="submit" class="btn mt-3">Comentar</button>
          </form>
        </Card>   
    </div>
</template>

<script>
export default {
  props: {
    // unique identifier for content-id
    uid: {
      type: String,
      required: true
    }
  },
  /*
  async mounted() {
  try {
    await this.$recaptcha.init()
  } catch (e) {
    console.error(e);
  }
},
beforeDestroy() {
  this.$recaptcha.destroy()
},
methods: {
    async onSubmit() {
      try {
        const token = await this.$recaptcha.execute('login')
        console.log('ReCaptcha token:', token)

       // do things here...

      } catch (error) {
        console.log('Login error:', error)
      }
    },
  },
  */
  data() {
      return {
        comentarios: [],
        respuesta: '',
        responderA: null,
        nuevoComentario: '',
      }
    },
  async fetch() {
    await this.cargarComentarios()
  },
  computed: {
      comentariosListado() {
          return this.comentarios
      }
  },
  methods: {
    async cargarComentarios() {
      console.log('fetch uid=', this.uid)
      const comentarios = await this.$strapi.find('comentarios', {uid: this.uid, _sort: 'updated_at:ASC'})
      this.$emit('count', comentarios.length)
      this.comentarios = comentarios
    },
    async comentar() {
      await this.$axios
      .$post("/api/comentarios", {
        uid: this.uid,
        texto: this.nuevoComentario
      })
      this.nuevoComentario = ''
      this.cargarComentarios()
    },
    async responder(respondiendo) {
      await this.$axios
      .$post("/api/comentarios", {
        uid: this.uid,
        respondiendo, 
        texto: this.respuesta
      })
      this.responderA = null
      this.respuesta = ''
      this.cargarComentarios()
    },
    onResponder(id) {
      this.responderA=id;
      this.$nextTick(()=>{
        this.$scrollTo('#respuesta-a-'+id, 500, {offset: -150})
        const el = document.querySelector('#respuesta-a-'+id+' input[type=text]')
        if(el) el.focus()
      })
    }
  }
}
</script>

<style scoped>
  .mouse .actions {
    @apply opacity-0 transition duration-200 pointer-events-none;
  }
  .mouse .comment:hover >div>section>.actions {
    @apply opacity-100 pointer-events-auto;
  }
</style>