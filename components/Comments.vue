<template>
  <div class="max-w-xl mx-auto" :class="$device.isMobileOrTablet ? 'touch' : 'mouse'">


    <div v-for="comentario of comentarios" :key="comentario.id">
      <Comment :id="`comentario-${comentario.id}`" :data="comentario" @responder="onResponder($event)" />

      <Card v-if="responderA === comentario.id" :id="'respuesta-a-' + comentario.id" class="p-5">
        <form @submit.prevent="responder(comentario.id)">
          <input type="text" v-model="respuestaTexto" placeholder="Respuesta..." />
          <button type="submit" class="btn mt-3">Responder</button>
        </form>
      </Card>


      <!-- respuestas -->
      <div class="w-full mt-5 pl-12">
        <div v-for="respuesta of comentario.respuestas" :key="respuesta.id" :id="`comentario-${respuesta.id}`"
          class="comment flex flex-col mb-5">

          <Comment :id="`comentario-${respuesta.id}`" :data="respuesta" @responder="onResponder($event)" />

          <Card v-if="responderA === respuesta.id" :id="'respuesta-a-' + respuesta.id" class="p-5">
            <form @submit.prevent="responder(comentario.id)">
              <input type="text" v-model="respuestaTexto" placeholder="Respuesta..." />
              <button type="submit" class="btn mt-3">Responder</button>
            </form>
          </Card>

        </div>
      </div>


    </div>

    <Card v-if="$strapi.user" class="p-5">
      <form @submit.prevent="comentar">
        <textarea rows="4" type="text" v-model="nuevoComentario" :placeholder="placeholder" minlength="4" />
        <div>
          <div v-for="item, index of imagenesSubir" :key="index" class="group relative my-2">
            <nuxt-img :src="item.src" class="w-full" sizes="xs:100vw" />
            <div
              class="btn btn-error absolute right-2 top-2 text-xl p-0 w-7 h-7 flex justify-center items-center rounded-full transition duration-200 opacity-0 group-hover:opacity-100"
              @click="eliminarDeImagenes(index)" title="Eliminar imagen">&times;</div>
          </div>
        </div>
        <div class="mt-2 flex justify-between items-center">
          <button type="submit" class="btn" :disabled="enviando || !nuevoComentario">{{ buttonLabel }}</button>
          <InputImage v-if="$strapi.user" multiple id="imagen" :value="imagenesSubir" @change="onImagenes" class="my-3"
            textButton iconButton />
        </div>
      </form>
    </Card>

    <div v-else class="text-center">
      <NLink class="btn" :to="'/ingresar?desde=' + encodeURIComponent($route.fullPath)">Inicia sesión para comentar
      </NLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // unique identifier for content-id
    uid: {
      type: String,
      required: true
    },
    contentTitle: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Nuevo comentario...'
    },
    buttonLabel: {
      type: String,
      required: false,
      default: 'Comentar'
    },
    reload: {
      type: Boolean | Number,
      required: false,
      default: 0
    }
  },
  /*
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
  watch: {
    reload(newValue) {
      console.log('changed reload', newValue)
      this.$fetch()
    }
  },
  data() {
    return {
      meta: {},
      comentarios: [],
      respuestaTexto: '',
      responderA: null,
      nuevoComentario: '',
      enviando: false,
      imagenesSubir: [],
      // para mixin likes.js
      ccollection: 'comentarios',
      checkHash: null
    }
  },
  mounted() {
    this.checkHash = setTimeout(() => {
      if (this.$route.hash && this.$route.hash.match(/^#comentario/))
        this.$scrollTo(this.$route.hash, 900, { offset: -250 })
    }, 1000)
  },
  beforeUnmount() {
    clearTimeout(this.checkHash)
  },
  async fetch() {
    await this.cargarComentarios()
  },
  methods: {
    onImagenes(payload) {
      for (const i in payload.images)
        this.imagenesSubir.push({ src: payload.images[i], file: payload.files[i] })
    },
    eliminarDeImagenes(index) {
      this.imagenesSubir.splice(index, 1)
    },
    async cargarComentarios() {
      // console.log('fetch uid=', this.uid)
      const { data: comentarios, meta } = await this.$strapi.find('comentarios', {
        filters: {
          uid: { $eq: this.uid },
          respondiendo: {
            id: {
              $null: true
            }
          }
        },
        populate: {
          respuestas: '*'
        },
        sort: 'updatedAt:desc',
        pagination: {
          pageSize: 999
        }
      })
      this.meta = meta
      this.comentarios = comentarios
      console.warn(comentarios)
      // this.$set(this, 'comentarios', comentarios /* .map(x=>({...x, IlikeIt: this.IlikeIt(x)})) */)
      // this.$emit('count', comentarios.length)
    },
    async subirImagenes() {
      if (!this.imagenesSubir.length) return []
      const form = new FormData()
      for (const img of this.imagenesSubir)
        form.append("files", img.file)
      return await this.$strapi.create("upload", form)
        .then(async (response) => {
          return response
        })
        .catch(err => {
          console.warn(err)
          return []
        })
    },
    async comentar() {
      this.enviando = true;
      const imagenes = await this.subirImagenes() || []
      console.log('imagenes subidas', imagenes)
      /*this.$strapi.$http.$post('/comentarios', {
       uid: this.uid,
       texto: this.nuevoComentario
     })*/
      this.$strapi.create('comentarios', {
        uid: this.uid,
        texto: this.nuevoComentario,
        adjuntos: imagenes.map(x => x.id)
      })
        .then(comentario => {
          console.log('respuesta', comentario)
          // registro de actividad
          console.log('this', this)
          /*this.$strapi.create('historials', {
            accion: 'comentario',
            titulo: this.contentTitle,
            url: this.uid
          })*/

          this.enviando = false
          this.imagenesSubir = []
          this.nuevoComentario = ''
          this.cargarComentarios()
          this.$emit('commented')
        })

    },
    async responder(respondiendo) {
      await this.$strapi.create('comentarios', {
        uid: this.uid,
        respondiendo,
        texto: this.respuestaTexto
      })
        .then(comentario => {
          console.log('respuesta', comentario)
          // registro de actividad
          this.$strapi.create('historials', {
            accion: 'comentario_respuesta',
            titulo: this.contentTitle,
            url: this.uid + '#comentario-' + respondiendo
          })
        })
      this.responderA = null
      this.respuestaTexto = ''
      await this.cargarComentarios()
      this.$emit('commented')
    },
    onResponder(id) {
      if (!this.$strapi.user) return
      this.respuestaTexto = ''
      this.responderA = id
      this.$nextTick(() => {
        this.$scrollTo('#respuesta-a-' + id, 500, { offset: -250 })
        const el = document.querySelector(
          '#respuesta-a-' + id + ' input[type=text]'
        )
        if (el) el.focus()
      })
    }
  }
}
</script>
