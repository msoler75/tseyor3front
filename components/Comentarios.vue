<template>
    <div class="max-w-xl mx-auto"
    :class="$device.isMobileOrTablet?'touch':'mouse'">
        <Card v-for="comentario of comentariosFiltrados" :key="comentario.id" class="comment flex flex-col mb-3 p-1 sm:p-5">
            <div class="flex w-full">
                <Avatar :data="comentario.autor" class="text-3xl w-16 h-16 mr-6"/>
                <section>
                  <div class="flex justify-start items-baseline text-sm text-blue-gray">
                      <NLink v-if="comentario.autor.id" :to="'/usuarios/'+comentario.autor.id" class="font-bold">{{comentario.autor.nombre}}</NLink> 
                      <span v-else class="font-bold">{{comentario.autor.nombre}}</span> 
                      <span class="mx-2 opacity-50">•</span>
                      <span class="text-xs">{{ $dayjs(comentario.fecha).fromNow() }}</span>
                  </div>
                  <div class="text-justify" v-html="comentario.texto"/>
                  <div class="actions mt-2 flex items-center text-xs">
                    <icon icon="far fa-heart mr-3"/>
                    <span class="link">Responder</span>
                  </div>
                </section>
            </div>
        </Card>

        <Card class="p-5">
          <form @submit.prevent="onSubmit">
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
 methods: {
    onSubmit() {
      return false
    },
  },
  data() {
      return {
        comentarios: [],
        nuevoComentario: '',
      }
    },
  async fetch() {
    for (let i = 1; i < 7; i++) {
      this.comentarios.push({
        id: i,
        clase: "comentarios",
        autor: {
            id: i!==2?(i*177)%255:null,
            clase: "usuarios",
            imagen: i!==2?"usuario" + ((i % 8) + 1) + ".jpg" : null,
            nombre: this.$lorem(1, 1, 3).slice(0, -1)
        },
        texto: this.$lorem(Math.min(-1, Math.ceil(Math.random()*-3))),
        fecha:
          2016 +
          Math.floor(Math.random() * 4) +
          "/" +
          Math.ceil(Math.random() * 12) +
          "/" +
          Math.ceil(Math.random() * 28)
      });
    }
  },
  computed: {
      comentariosFiltrados() {
          return this.comentarios.sort((a,b)=>this.$dayjs(b.fecha).diff(this.$dayjs(a.fecha)))
      }
  },
}
</script>

<style scoped>
  .mouse .actions {
    @apply opacity-0 transition duration-200 pointer-events-none;
  }
  .mouse .comment:hover .actions {
    @apply opacity-100 pointer-events-auto;
  }
</style>