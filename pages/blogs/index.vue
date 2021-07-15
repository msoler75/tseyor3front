<template>
  <div>
    <h1 class="text-center">Blogs de Tseyor</h1>
    <divider />
    <Grid class="text-center">
      <Card v-for="entrada of entradasBlog" :key="entrada.id"
      :data="entrada"/>
    </Grid>
  </div>
</template>

<script>
export default {
  asyncData ({app}) {
    const entradas = []
    for (let i = 1; i < 16; i++) {
      entradas.push(
        {
          id: i,
          clase: 'entradas',
          titulo: app.$lorem(1),
          imagen: 'imagen' + (i % 6 + 1) + '.jpg',
          texto:  app.$lorem(3),
          blog: {
            id: i,
            clase: 'blogs',
            imagen: 'imagen' + ((i * 3) % 6 + 1) + '.jpg',
            nombre: 'Blog ' + i,
            descripcion: app.$lorem(3)
          }
        })
    }
    return { entradas }
  },
  computed: {
    entradasBlog () {
      return this.entradas.map((x) => { return { ...x, tags: [x.blog.nombre] } })
    }
  }
}
</script>
