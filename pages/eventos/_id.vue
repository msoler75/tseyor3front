<template>
  <section contained="no" focused>

    <NLink v-if="contenido.autor && $strapi.user && $strapi.user.id === contenido.autor.id"
      class="btn absolute -top-12 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      :to="`/eventos/editar/${contenido.id}`">
      <icon icon="edit" />
      <span class="ml-2 hidden sm:inline">Editar</span>
    </NLink>

    <Card v-if="$dayjs().isAfter($dayjs(evento.fechaFinal))"
      class="absolute right-1 mt-1 font-bold text-xs p-1 sm:p-4 sm:text-base bg-orange text-orange-contrast">Evento
      Pasado</Card>

    <div class="evento-wrapper bg-blue-gray dark:bg-blue-gray-900 grid w-full pb-9"
      style="margin-top: calc(54vh - 170px)">
      <div class="order-1 bg-red text-center flex justify-center items-center h-20 md:col-span-2 xl:col-span-1">
        <div class="p-5 font-bold text-white text-3xl lg:text-4xl">{{
            $dayjs(evento.fechaComienzo).format('D MMM YYYY')
        }}</div>
      </div>
      <div class="order-2 bg-red h-20 hidden xl:block xl:order-3" />
      <Card class="rounded-none rounded-b-md order-4 p-7 xl:order-2 xl:row-span-2">
        <h1 class="text-center">{{ ctitle }}</h1>
        <Article class="text-justify" v-html="evento.textoHTML || evento.descripcion" />
        <div class="mt-5 space-y-3 mb-7">
          <nuxt-img v-for="img of contenido.imagenes" :key="img.url" :src="img.url" class="mx-auto imagenes" />
        </div>
      </Card>
      <div class="order-5 md:order-3 xl:order-4 flex flex-col space-y-6 justify-start items-center">
        <Card class="sticky top-20 p-7 m-5 mt-12 whitespace-nowrap text-gray-700 flex flex-wrap lg:flex-col">
          <p class="my-1" v-if="evento.sala">
            <icon icon="globe" class="!w-8 mr-2 text-gray" />Evento online
          </p>
          <p class="my-1">
            <icon icon="calendar-alt" class="!w-8 mr-2 text-gray" />
            {{ $dayjs(evento.fechaComienzo).format('D MMM YYYY') }}
            <template v-if="evento.fechaFinal">
              <span class="text-diminished">—</span>
              {{ $dayjs(evento.fechaFinal).format('D MMM') }}
            </template>
          </p>
          <p class="my-1" v-if="evento.sala">
            <icon icon="door-open" class="!w-8 mr-2 text-gray" />
            <NLink :to="'/salas/' + evento.sala.id">{{ evento.sala.nombre }}</NLink>
          </p>
          <p class="my-1">
            <icon icon="hourglass" class="!w-8 mr-2 text-gray" />
            {{ $dayjs(evento.fechaComienzo).fromNow() }}
          </p>


          <button class="mt-9 btn btn-warning text-lg mx-auto w-32" :disabled="eventoPasado || actualizando"
            @click="quieroAsistir = !quieroAsistir">
            <input class="pointer-events-none mr-4 scale-150" type="checkbox" readonly v-model="quieroAsistir">
            <span>Asistiré</span>
          </button>

          <template v-if="evento.asistentes.length">
            <p class="mt-14 mb-2 font-bold text-center">Asistentes:</p>
            <div class="flex flex-wrap justify-center">
              <Avatar v-for="user of evento.asistentes" :key="user.id" :data="user" class="w-12 h-12 m-1" />
            </div>
          </template>

        </Card>
      </div>
    </div>

    <section class="surface w-full py-7">
      <!-- share modal -->
      <Comparte v-model="viendoCompartir" />

      <SocialButtons id="social" :uid="uid" :data="contenido" @like="like" @dislike="dislike"
        @share="viendoCompartir = true" class="mx-auto max-w-xl my-7 lg:my-16" />

      <!-- comentarios -->
      <div id="comentarios" class="mx-auto bg-opacity-90 bg-gray-200 py-9">
        <h3 v-if="contenido.comentarios" class="text-center">
          {{
              contenido.comentarios +
              " Comentario" +
              (contenido.comentarios !== 1 ? "s" : "")
          }}
        </h3>
        <h3 v-else class="text-center">Coméntalo</h3>
        <Comments :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)"
          class="px-1 xs:px-2" />
      </div>
    </section>
  </section>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
  mixins: [vercontenido, likes, seo],
  async asyncData({ route, $strapi, $mdToHtml, $error }) {
    try {
      const contenido = await $strapi.getContent(route, { populate: '*' })
      if (!contenido)
        return $error(404, 'Evento no disponible')
      contenido.textoHTML = $mdToHtml(contenido.texto, contenido.imagenes)
      // let quieroAsistir = $strapi.user && !!evento.asistentes.find(x => x.id === $strapi.user.id)
      let quieroAsistir = true
      return { contenido, evento: contenido, quieroAsistir };
    }
    catch (err) {
      console.warn(JSON.stringify(err))
      $error(503)
    }
  },
  mounted() {
    if (this.contenido.imagen)
      this.$store.commit('setBackgroundImageUrl', this.contenido.imagen.url)
  },
  data() {
    return {
      actualizando: false
    }
  },
  computed: {
    eventoPasado() {
      const now = this.$dayjs()
      return this.$dayjs(this.evento.fechaComienzo).isBefore(now)
    }
  },
  watch: {
    quieroAsistir(asistire) {
      if (!this.$strapi.user) return
      this.actualizando = true
      this.$strapi.$http.$put(`/eventos/${this.contenido.id}/${asistire ? 'join' : 'leave'}`)
        .then(evento => {
          console.log('res as', evento)
          this.actualizando = false
          this.$set(this.contenido, 'asistentes', evento.asistentes)
          const asiste = this.$strapi.user && !!this.contenido.asistentes.find(x => x.id === this.$strapi.user.id)
          if (asiste)
            this.$strapi.create('historials', {
              accion: 'evento_asiste',
              titulo: this.ctitle,
              url: this.uid
            })
        })
        .catch(err => {
          this.actualizando = false
        })
    }
  }
};
</script>

<style scoped>
@screen md {
  .grid {
    grid-template-columns: 1fr 2fr;
  }
}

@screen lg {
  .grid {
    grid-template-columns: 1fr minmax(500px, 2fr);
  }
}

@screen xl {
  .grid {
    grid-template-columns: 3fr minmax(500px, 5fr) 2fr;
    grid-template-rows: 90px 1fr;
  }
}

.h-image {
  @apply h-24;
}

@screen sm {
  .h-image {
    height: 40vh;
    max-height: 280px;
    min-height: 80px;
  }
}

.evento-wrapper {
  background-size: 10px 10px;
  background-image: repeating-linear-gradient(45deg,
      transparent 0,
      #444cf7 1px,
      transparent 0,
      transparent 50%);
}

.imagenes {
  max-height: 80vh
}
</style>