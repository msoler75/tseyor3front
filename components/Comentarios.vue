<template>
    <div class="max-w-xl mx-auto"
    :class="$device.isMobileOrTablet?'touch':'mouse'">
        <div v-for="comentario of comentariosFiltrados" :key="comentario.id" class="comment flex flex-col mb-5">
            <div class="flex w-full">
                <Avatar :data="comentario.autor" class="text-3xl w-8 h-8 sm:w-16 sm:h-16 mr-2 sm:mr-3 lg:mr-5"/>
                <section>
                  <Card class="w-full p-1 xs:p-2 sm:p-4">
                    <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                        <NLink v-if="comentario.autor.id" :to="'/usuarios/'+comentario.autor.id" class="font-bold mb-1">{{comentario.autor.nombre}}</NLink> 
                        <span v-else class="font-bold">{{comentario.autor.nombre}}</span> 
                        <span class="mx-2 opacity-50">•</span>
                        <span class="text-xs">{{ $dayjs(comentario.fecha).fromNow() }}</span>
                    </div>
                    <div class="text-justify text-sm lg:text-base" v-html="comentario.texto"/>
                  </Card>
                  <div class="actions mt-2 flex justify-start items-center text-xs px-2">
                    <icon icon="far fa-heart" class="cursor-pointer mr-5"/>
                    <span class="link cursor-pointer">Responder</span>
                  </div>
                
                <!-- respuestas -->
                <div v-if="comentario.respuestas.length" class="w-full mt-5">
                  <div v-for="respuesta of comentario.respuestas" :key="respuesta.id" class="comment flex flex-col mb-5">
                    <div class="flex w-full">
                    <Avatar :data="respuesta.autor" class="text-3xl w-8 h-8 mr-2 sm:mr-3 lg:mr-5"/>
                    <section>
                      <Card class="w-full p-1 xs:p-2 sm:p-4">
                        <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                            <NLink v-if="respuesta.autor.id" :to="'/usuarios/'+respuesta.autor.id" class="font-bold mb-1">{{respuesta.autor.nombre}}</NLink> 
                            <span v-else class="font-bold">{{respuesta.autor.nombre}}</span> 
                            <span class="mx-2 opacity-50">•</span>
                            <span class="text-xs">{{ $dayjs(respuesta.fecha).fromNow() }}</span>
                        </div>
                        <div class="text-justify text-sm lg:text-base" v-html="respuesta.texto"/>
                      </Card>
                      <div class="actions mt-2 flex justify-start items-center text-xs px-2">
                        <icon icon="far fa-heart" class="cursor-pointer mr-5"/>
                        <span class="link cursor-pointer">Responder</span>
                      </div>
                    </section>
                    </div>
                  </div>
                </div>

                </section>

            </div>
        </div>

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
      const respuestas = []
      const numr = Math.random()*3
      for(let j = 1; j<numr; j++)
        respuestas.push( {
            id: i,
            clase: "comentarios",
            autor: {
                id: j+i!==3?(i*j*177)%255:null,
                clase: "usuarios",
                imagen: j+i!==3?"usuario" + (((j+i) % 8) + 1) + ".jpg" : null,
                nombre: this.$lorem(1, 1, 3).slice(0, -1)
            },
            texto: this.$lorem(Math.min(-1, Math.ceil(Math.random()*-3))),
            fecha:
              2016 +
              Math.floor(Math.random() * 4) +
              "/" +
              Math.ceil(Math.random() * 12) +
              "/" +
              Math.ceil(Math.random() * 28),
        })

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
          Math.ceil(Math.random() * 28),
        respuestas
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
  .mouse .comment:hover >div>section>.actions {
    @apply opacity-100 pointer-events-auto;
  }
</style>