<template>
<section class="max-w-md mx-auto">
  <h1>{{boletin.titulo}}</h1>
  <h2>Noticias</h2>
  <Grid>
    <Card v-for="noticia of boletin.noticias"
        :data="noticia"
        :key="'noticia-'+noticia.id"
        collection="noticias"          
      />
  </Grid>
  <h2>Comunicados</h2>
  <Grid>
    <Card v-for="comunicado of boletin.comunicados"
        :data="comunicado"
        :key="'comunicado-'+comunicado.id"
        collection="comunicados"          
      />
  </Grid>
  <h2>Blogs</h2>
  <Grid>
    <Card v-for="entrada of boletin.entradas"
        :data="entrada"
        :key="'entrada-'+entrada.id"
        collection="entradas"          
      />
  </Grid>
  <h2>Libros</h2>
  <Grid>
    <Card v-for="libro of boletin.libros"
        :data="libro"
        :key="'libro-'+libro.id"
        collection="libros"          
      />
  </Grid>
  <h2>Audios</h2>
  <Grid>
    <Card v-for="audio of boletin.audios"
        :data="audio"
        :key="'audio-'+audio.id"
        collection="audios"          
      />
  </Grid>

</section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {
      const id = route.params.id
      const boletines = await $strapi.find('boletines', id.match(/\d+/)?{id}:{slug:id})
      const contenido = boletines[0]
      return { contenido, boletin: contenido };
    }
    catch(error)
    {
      console.error(error)
    }
  },
};
</script>

<style scoped>
</style>