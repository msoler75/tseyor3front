<template>
<div>
    <HCarousel :items="guias" :center="true" :noText="true" collection="guias"/>
</div>
</template>


<script>
const query_guias = `guias(sort: "nombre:asc")  {
          slug
          nombre
          imagen {
            url
            width
            height
          }
        }`

export default {
 data() {
     return {
         guias: []
     }
 },
 async fetch() {
   const resultado = await this.$strapi.graphql({
      query:
        `query {
          ${query_guias}
        }`
    })
   this.guias = resultado.guias.map(x=>{return {...x, href: '/guias-estelares/'+x.slug}})
 },
};
</script>

