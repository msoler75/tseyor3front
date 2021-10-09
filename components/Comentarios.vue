<template>
  <div
    class="max-w-xl mx-auto"
    :class="$device.isMobileOrTablet ? 'touch' : 'mouse'"
  >
    <div
      v-for="comentario of comentariosPrimerNivel"
      :key="comentario.id"
      class="comment flex flex-col mb-5"
    >
      <div class="flex w-full">
        <Avatar
          :data="comentario.user"
          class="text-3xl w-8 h-8 sm:w-16 sm:h-16 mr-2 sm:mr-3 lg:mr-5"
        />
        <section class="group select-none">
          <Card class="w-full p-1 xs:p-2 sm:p-4">
            <div
              class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray"
            >
              <NLink
                v-if="comentario.user.id"
                :to="'/usuarios/' + comentario.user.id"
                class="font-bold mb-1"
                >{{ mostrarNombre(comentario.user) }}</NLink
              >
              <span v-else class="font-bold">{{
                mostrarNombre(comentario.user)
              }}</span>
              <span class="mx-2 opacity-50">•</span>
              <span class="text-xs">{{
                $dayjs(comentario.updated_at).fromNow()
              }}</span>
            </div>
            <div
              class="text-justify text-sm lg:text-base"
              v-html="$renderMarkdownServer(comentario.texto)"
            />
          </Card>

          <div
            v-if="isAuthenticated"
            class="mt-2 flex justify-start items-center text-xs px-2"
          >
            <a
              v-if="comentario.likes.length"
              class="mr-5 cursor-pointer"
              @click="likeit(comentario)?dislike(comentario.id):{}"
            >
              <icon icon="fas fa-heart" class="text-red" />
              {{ comentario.likes.length }}
            </a>
            <a v-else class="mr-5 cursor-pointer"
              @click="likeit(comentario)?{}:like(comentario.id)">
              <icon icon="far fa-heart" />
            </a>

            <span
              v-if="!likeit(comentario)"
              class="mr-5 opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
              @click="like(comentario.id)"
              >Me gusta</span
            >

            <span
              class="opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
              @click="onResponder(comentario.id)"
              >Responder</span
            >
          </div>

          <!-- respuestas -->
          <div v-if="comentario.respuestas.length" class="w-full mt-5">
            <div
              v-for="respuesta of getRespuestas(comentario.respuestas)"
              :key="respuesta.id"
              class="comment flex flex-col mb-5"
            >
              <div class="flex w-full">
                <Avatar
                  :data="respuesta.user"
                  class="text-3xl w-8 h-8 mr-2 sm:mr-3 lg:mr-5"
                />
                <section>
                  <Card class="w-full p-1 xs:p-2 sm:p-4">
                    <div
                      class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray"
                    >
                      <NLink
                        v-if="respuesta.user.id"
                        :to="'/usuarios/' + respuesta.user.id"
                        class="font-bold mb-1"
                        >{{ mostrarNombre(respuesta.user) }}</NLink
                      >
                      <span v-else class="font-bold">{{
                        mostrarNombre(respuesta.user)
                      }}</span>
                      <span class="mx-2 opacity-50">•</span>
                      <span class="text-xs">{{
                        $dayjs(respuesta.updated_at).fromNow()
                      }}</span>
                    </div>
                    <div
                      class="text-justify text-sm lg:text-base"
                      v-html="$renderMarkdownServer(respuesta.texto)"
                    />
                  </Card>
                  <div
                    v-if="isAuthenticated"
                    class="mt-2 flex justify-start items-center text-xs px-2"
                  >
                   <a
                    v-if="respuesta.likes.length"
                    class="mr-5 cursor-pointer"
                    @click="likeit(respuesta)?dislike(respuesta.id):{}"
                  >
                    <icon icon="fas fa-heart" class="text-red" />
                    {{ respuesta.likes.length }}
                  </a>
                  <a v-else class="mr-5 cursor-pointer"
                    @click="likeit(respuesta)?{}:like(respuesta.id)">
                    <icon icon="far fa-heart" />
                  </a>

                  <span
                    v-if="!likeit(respuesta)"
                    class="mr-5 opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                    @click="like(respuesta.id)"
                    >Me gusta</span
                  >
                    <span
                      class="opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                      @click="onResponder(comentario.id)"
                      >Responder</span
                    >
                  </div>
                </section>
              </div>
            </div>
          </div>

          <Card
            v-if="isAuthenticated"
            :id="'respuesta-a-' + comentario.id"
            class="p-5"
            v-show="responderA === comentario.id"
          >
            <form @submit.prevent="responder(comentario.id)">
              <input
                type="text"
                v-model="respuesta"
                placeholder="Respuesta..."
              />
              <button type="submit" class="btn mt-3">Responder</button>
            </form>
          </Card>
        </section>
      </div>
    </div>

    <Card v-if="isAuthenticated" class="p-5">
      <form @submit.prevent="comentar">
        <input
          type="text"
          v-model="nuevoComentario"
          placeholder="Nuevo comentario..."
        />
        <button type="submit" class="btn mt-3">Comentar</button>
      </form>
    </Card>
    <div v-else class="text-center">
      <NLink
        class="btn"
        :to="'/login?desde=' + encodeURIComponent($route.fullPath)"
        >Inicia sesión para comentar</NLink
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
  data () {
    return {
      comentarios: [],
      respuesta: '',
      responderA: null,
      nuevoComentario: '',
      // para mixin likes.js
      ccollection: 'comentarios'
    }
  },
  async fetch () {
    await this.cargarComentarios()
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    comentariosPrimerNivel () {
      return this.comentarios.filter(x => !x.respondiendo)
    },
    comentariosSegundoNivel () {
      return this.comentarios.filter(x => x.respondiendo)
    }
  },
  methods: {
    mostrarNombre (user) {
      return user.nombreSimbolico || user.username
    },
    getRespuestas (respuestas) {
      const r = []
      for (const respuesta of respuestas) {
        r.push(this.comentariosSegundoNivel.find(x => x.id === respuesta.id))
      }
      return r
    },
    async cargarComentarios () {
      // console.log('fetch uid=', this.uid)
      const comentarios = await this.$strapi.find('comentarios', {
        uid: this.uid,
        _sort: 'updated_at:ASC'
      })
      this.$emit('count', comentarios.length)
      this.comentarios = comentarios
    },
    async comentar () {
      await this.$strapi.$http.$post('/api/comentarios', {
        uid: this.uid,
        texto: this.nuevoComentario
      })
      this.nuevoComentario = ''
      this.cargarComentarios()
    },
    async responder (respondiendo) {
      await this.$strapi.$http.$post('/api/comentarios', {
        uid: this.uid,
        respondiendo,
        texto: this.respuesta
      })
      this.responderA = null
      this.respuesta = ''
      this.cargarComentarios()
    },
    onResponder (id) {
      this.responderA = id
      this.$nextTick(() => {
        this.$scrollTo('#respuesta-a-' + id, 500, { offset: -250 })
        const el = document.querySelector(
          '#respuesta-a-' + id + ' input[type=text]'
        )
        if (el) el.focus()
      })
    },

    // ---- LIKES ----
    likeit (comentario) {
      console.log('likeit', comentario)
      console.log('mi user id', this.$strapi.user.id)
      if (!this.$strapi.user) return false
      return !!comentario.likes.find(x => x.id === this.$strapi.user.id)
    },
    async refreshItem (id) {
      console.log('refreshItem', id)
      const likes = await this.$strapi.find('likes', {
        uid: 'comentarios-' + id
      })
      this.saveRefreshedItem(
        id,
        likes.map(x => x.user)
      )
    },
    async like (id) {
      if (!this.$strapi.user) return
      console.log('like comment', id)
      this.likedItem(id)
      await this.$strapi.$http.$put(`/api/comentarios/${id}/like`)
      await this.$strapi.$http.$post('/api/likes', {
        uid: 'comentarios-' + id
      })
      // este paso es opcional:
      // this.refreshItem(id);
    },
    async dislike (id) {
      if (!this.$strapi.user) return
      console.log('dislike comment', id)
      this.dislikedItem(id)
      await this.$strapi.$http.$put(`/api/comentarios/${id}/dislike`)
      const results = await this.$strapi.find('likes', {
        uid: 'comentarios-' + id,
        user: this.$strapi.user.id
      })
      if (results.length) {
        await this.$strapi.$http.$delete(`/api/likes/${results[0].id}`)
        // este paso es opcional:
        // this.refreshItem(id);
      }
    },
    likedItem (id) {
      const comentario = this.comentarios.find(x => x.id === id)
      if (comentario) {
        console.log('comentario', comentario)
        comentario.likes.push({ id: this.$strapi.user.id })
      }
    },
    dislikedItem (id) {
      const comentario = this.comentarios.find(x => x.id === id)
      if (comentario) {
        console.log('comentario', comentario)
        const idx = comentario.likes.findIndex(x => x.id === this.$strapi.user.id)
        if (idx > -1) comentario.likes.splice(idx, 1)
      }
    },
    saveRefreshedItem (id, likes) {
      console.log('saveRefreshedItem', id, likes)
      const comentario = this.comentarios.find(x => x.id === id)
      console.log('found', comentario)
      if (comentario) this.$set(comentario, 'likes', likes)
    }
    // ---- end LIKES ----
  }
}
</script>
