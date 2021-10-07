<template>
  <section class="flex justify-center">
    <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
      <div class="my-4 mx-auto w-36 h-36 overflow-hidden rounded-full shadow">
        <nuxt-img :src="cimage" width="172" />
      </div>
      <h1>{{ usuario.nombreSimbolico || usuario.username }}</h1>

      <blockquote v-if="usuario.frase" class="mt-2 mb-4">
        <p>{{ usuario.frase }}</p>
      </blockquote>

      <section class="my-3">
        <div class="px-6 pt-4 pb-2 mt-auto">
          <span
            v-for="grupo of usuario.grupos"
            :key="grupo.id"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {{ grupo.nombre }}
          </span>
        </div>
      </section>
      <divider />

      <section>
        <h2>Equipos</h2>
        <div class="px-6 pt-4 pb-2 mt-auto">
          <NLink
            v-for="equipo of usuario.equipos"
            :key="equipo.id"
            :to="'/equipos/' + equipo.id"
            class="inline-block bg-gray-200 dark:bg-gray-dark-700 text-gray-700 dark:text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {{ equipo.nombre }}
          </NLink>
        </div>
      </section>
      <divider />

      <section>
        <h2>Últimos Comentarios</h2>
        <div
          v-if="usuario.comentarios && usuario.comentarios.length"
          class="w-full space-y-4"
        >
          <div
            v-for="comentario of usuario.comentarios"
            :key="comentario.id">
          <Card
            class="p-2 bg-blue-gray-50 dark:bg-blue-gray-900"
            
          >
            <NLink
              :to="contenidoref(comentario)"
              class="flex items-center"
            >
              <icon class="mr-2" icon="far fa-comment" />
              <div v-html="$teaser(comentario.texto, 96)" />
            </NLink> 

            <div class="mt-2 text-right text-xs text-diminished">
              {{ $dayjs(comentario.published_at).fromNow() }}
          </div>           
          </Card>
          
          </div>
        </div>
        <p v-else class="text-center italic">No hay comentarios</p>
      </section>

      <divider />
      <section class="mb-9">
        <a class="btn inline-block mx-auto" icon="fas fa-mail">Contactar</a>
      </section>
    </Card>
  </section>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData ({ $strapi, route }) {
    const id = route.params.id
    const usuarios = await $strapi.find('users', { id })
    const contenido = usuarios[0]
    return { contenido, usuario: contenido }
  },
  computed: {
    cimage () {
      return this.usuario && this.usuario.imagen && this.usuario.imagen.url
        ? this.usuario.imagen.url
        : '/imagenes/usuario.jpg'
    }
  },
  methods: {
    contenidoref (comentario) {
      return '/' + comentario.uid.replace('-', '/') + '#comentarios'
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
