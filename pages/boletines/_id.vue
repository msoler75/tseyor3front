<template>
  <section class="container container-lg mx-auto">
    <h1>{{ boletin.titulo }}</h1>
    <template v-if="boletin.noticias.length">
      <h2>Noticias</h2>
        <CardEntry class="mb-8 p-7"
          v-for="noticia of boletin.noticias"
          :data="noticia"
          :key="'noticia-' + noticia.id"
          collection="noticias"
        />
    </template>

    <template v-if="boletin.eventos.length">
      <h2>Eventos</h2>
        <CardEntry class="mb-8 p-7"
          v-for="evento of boletin.eventos"
          :data="evento"
          :key="'evento-' + evento.id"
          collection="eventos"
        />
    </template>

    <template v-if="boletin.comunicados.length">
      <h2>Comunicados</h2>
        <CardEntry class="mb-8 p-7"
          v-for="comunicado of boletin.comunicados"
          :data="comunicado"
          :key="'comunicado-' + comunicado.id"
          collection="comunicados"
        />
    </template>

    <template v-if="boletin.entradas.length">
      <h2>Blogs</h2>
        <CardEntry class="mb-8 p-7"
          v-for="entrada of boletin.entradas"
          :data="entrada"
          :key="'entrada-' + entrada.id"
          collection="entradas"
        />
    </template>

    <template v-if="boletin.libros.length">
      <h2>Libros</h2>
        <CardEntry class="mb-8 p-7"
          v-for="libro of boletin.libros"
          :data="libro"
          :key="'libro-' + libro.id"
          collection="libros"
        />
    </template>

    <template v-if="boletin.audios.length">
      <h2>Audios</h2>
        <CardEntry class="mb-8 p-7"
          v-for="audio of boletin.audios"
          :data="audio"
          :key="'audio-' + audio.id"
          collection="audios"
        />
    </template>
  </section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  async asyncData({ $strapi, route, redirect }) {
    try {
      const id = route.params.id;
      const boletines = await $strapi.find(
        "boletines",
        id.match(/^\d+$/) ? { id } : { slug: id }
      );
      if(!boletines.length)
        return $error(404, 'Boletín no encontrado')
      const contenido = boletines[0];
      return { contenido, boletin: contenido };
    } catch (error) {
      console.error(error);
    }
  }
};
</script>