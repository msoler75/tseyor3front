<template>
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
  <div class="flex flex-col" background="no" contained="no">

    <div class="max-w-full w-lg mx-auto">
     <section class="mb-5 px-3 sm:px-5 md:px-7 flex flex-col space-y-3 xm:flex-row xm:space-y-0 xm:space-x-3">
      <NLink class="btn btn-gray" :to="'/equipos/' + contenido.equipo.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{ contenido.equipo.nombre }}
      </NLink>

       <NLink class="btn btn-gray" :to="'/actividades/' + contenido.actividad.id">
        <Icon icon="chevron-left" class="mr-3" />
        {{ contenido.actividad.titulo }}
      </NLink>
    </section>

    <!-- article container -->
    <div
      class="surface py-9 rounded px-3 sm:px-5 md:px-7 relative w-full shrink-0 flex-grow-1 max-w-3xl flex flex-col items-start self-center"
    >
      <h1 class="mb-0 flex items-center text-xl">Acta {{$dayjs(contenido.fecha).format("DD·MMM")}} de {{contenido.equipo.nombre}} / {{contenido.actividad.titulo}}</h1>
      <div class="hidden 4xl:block absolute right-0 translate-x-3 5xl:translate-x-10 h-full">
        <SocialIcons
          class="sticky top-32 mb-6 text-xs 5xl:text-sm"
          :likes="false"
          :content="contenido"
          @share="viendoCompartir = true"
        />
      </div>

      <!-- article wrapper -->
      <ArticleWrapper>
        <!-- article heading -->
        <h1 class>{{ ctitle }}</h1>

        <div class="w-full flex mb-5 items-center justify-start">
           <span class="flex items-center flex-wrap sm:flex-nowrap">
            <icon icon="far fa-calendar-alt" class="mr-1" /> {{$dayjs(contenido.fecha).format("DD·MMM·YYYY")}} <span class="px-2 py-1 text-xs shadow bg-yellow-300 dark:bg-yellow-600 dark:text-black rounded ml-4">{{$dayjs(contenido.fecha).fromNow()}}</span>
          </span>

          <div class="4xl:hidden ml-auto text-xs sm:text-sm">
            <SocialIcons :content="contenido" :horizontal="true" @share="viendoCompartir = true" />
          </div>
        </div>

        <divider/>
        
        <div class="my-9">
          <div class="text-justify" v-html="contenido.textoHTML" />
        </div>
      </ArticleWrapper>
    </div>

    </div>

    <section class="my-7 lg:my-16">
      <!-- modal -->
      <Comparte v-model="viendoCompartir" />

      <SocialButtons
        id="social"
        :data="contenido"
        :likebutton="false"
        @share="viendoCompartir = true"
        class="mx-auto max-w-xl my-7 lg:my-16"
      />
    </section>

    <SuscriptionSection
      id="suscription"
      :title="acta.equipo.nombre"
      :description="acta.equipo.descripcion"
      :to="'/equipo/' + acta.equipo.id"
      :image="acta.equipo.imagen"
      label="Ver Equipo"
      class="bg-blue-gray-900 w-full"
    />

    <!-- comentarios -->
    <div id="comentarios" class="container mx-auto my-9" v-observe-visibility="(isVisible)=>{mostrarComentarios=mostrarComentarios||isVisible}">
      <h3
        v-if="contenido.comentarios"
        class="text-center"
      >{{ contenido.comentarios + ' Comentario' + (contenido.comentarios !== 1 ? 's' : '') }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComments v-if="mostrarComentarios"  :uid="uid" :content-title="ctitle" @count="$set(contenido, 'comentarios', $event)" class="px-1 xs:px-2" />
    </div>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ app, $strapi, route, $error }) {
    try {
      const id = route.params.id
      const actas = await $strapi.find('actas', { id })
      if(!actas.length)
        return $error(404, 'Acta no encontrada')
      const contenido = actas[0]
      contenido.textoHTML = app.$renderMarkdownServer(contenido.texto)
      return { contenido, acta: contenido }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      mostrarComentarios: false,
    }
  }
}
</script>

<style scoped>
section >>> .article h2:first-of-type {
  display: none;
}
</style>