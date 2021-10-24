<template>
  <section>
    <Config :contained="false" :focused="true" />
    
    <NLink 
      v-if="isAuthenticated&&loggedInUser.id===contenido.autor.id"
      class="btn absolute top-24 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
      :to="`/eventos/editar/${contenido.id}`"
    >
      <icon icon="edit"/> <span class="ml-2 hidden sm:inline">Editar</span>
    </NLink>

    <section class="fixed left-0 top-0 w-screen h-[40vh] xl:h-[45vh]"  :style="imageBg"/>

    <Card
      v-if="$dayjs().isAfter($dayjs(evento.fechaFinal))"
      class="absolute right-1 mt-1 font-bold text-xs p-1 sm:p-4 sm:text-base bg-orange text-orange-contrast">
      Evento Pasado
    </Card>

    <div class="evento-wrapper bg-blue-gray dark:bg-blue-gray-900 grid w-full pb-9"
    style="margin-top: calc(40vh - 170px)">
      <div
        class="order-1 bg-red text-center flex justify-center items-center h-20 md:col-span-2 xl:col-span-1"
      >
        <div
          class="p-5 font-bold text-white text-3xl lg:text-4xl"
        >{{ $dayjs(evento.fechaComienzo).format('D MMM YYYY') }}</div>
      </div>
      <div class="order-2 bg-red h-20 hidden xl:block xl:order-3" />
      <Card class="rounded-none rounded-b-md order-4 p-7 xl:order-2 xl:row-span-2">
        <h1 class="text-center">{{ ctitle }}</h1>
        <Article class="text-justify" v-html="evento.textoHTML" />
      </Card>
      <div class="order-5 md:order-3 xl:order-4 flex justify-center items-start">
        <Card class="p-7 m-5 mt-12 whitespace-nowrap text-gray-700 flex flex-wrap lg:flex-col">
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
        </Card>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id
      const eventos = await $strapi.find('eventos', id.match(/\d+/) ? { id } : { slug: id })
      if (!eventos.length)
        return $error(404, 'Evento no encontrado')
      const contenido = eventos[0]
      contenido.textoHTML = app.$renderMarkdownServer(contenido.texto, contenido.imagenes)
      return { contenido, evento: contenido };
    }
    catch (e) {
      $error(503)
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
     imageBg () {
        const imgUrl = this.$img(this.cimage, {width: '100%', format: 'webp', quality: 70})
        return {
          backgroundImage: `url('${imgUrl}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          zIndex: -1
        }
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
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    #444cf7 1px,
    transparent 0,
    transparent 50%
  );
}
</style>