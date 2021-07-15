<template>
  <div>
    <h1>Noticias</h1>
    <Grid>
      <Card
        v-for="noticia of ultimasNoticias"
        :key="noticia.id"
        :data="noticia"
      />
    </Grid>
  </div>
</template>

<script>
// https://alexclark.co.nz/blog/using-apollo-and-graphql-with-nuxt-js/

// import { noticiasQuery } from '@/graphql/query'
export default {
  /* async */ asyncData({ app }) {
    // const noticiasGuays = await $strapi.$noticias.find({ id: 1 })
    const noticias = [];
    for (let i = 0; i < 12; i++) {
      noticias.push({
        id: i,
        clase: "noticias",
        imagen: "imagen" + ((i % 8) + 1) + ".jpg",
        titular: app.$lorem(1, 7, 20),
        texto: app.$lorem(10)
      });
    }
    return { noticias };
  },
  computed: {
    ultimasNoticias() {
      return this.noticias.slice(0, 7);
    },
    restoNoticias() {
      return this.noticias.slice(4);
    }
  }
  /* data () {
    return {
      noticias: []
    }
  },
  */
  /* apollo: {
    noticias: {
      prefetch: true,
      query: noticiasQuery
    }
  } */
};
</script>
