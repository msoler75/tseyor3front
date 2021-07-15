<template>
  <div>
    <h1>Usuarios</h1>
    <section class="my-3 flex flex-wrap justify-between">
        <div></div>
        <div class="ml-left">
            <SearchInput v-model="buscarPor" class="w-64 xl:mb-0" placeholder="Buscar por nombre o país..."/>
        </div>
    </section>
    <Grid class="grid-cols-fill-w-40">
      <CardUser
        v-for="usuario of usuariosFiltrados"
        :key="usuario.id"
        :data="usuario"
      />
    </Grid>
  </div>
</template>

<script>
export default {
  asyncData({ app }) {
    const usuarios = [];
    for (let i = 0; i < 24; i++) {
        const stats =  {
            publicaciones: {
                icon: 'fas fa-pen-alt', 
                value: Math.floor(Math.random(17))
            },
            comentarios: { 
                icon: 'far fa-comment', 
                value: Math.floor(Math.random(24)), 
            },
        }
      usuarios.push({
        id: i,
        clase: "usuarios",
        imagen: "usuario" + ((i % 7) + 1) + ".jpg",
        nombre: app.$lorem(1, 1, 4),
        texto: app.$lorem(1, 1, 1),
        stats
      });
    }
    return { usuarios };
  },
  data(){
      return { 
          buscarPor: ''
      }
  }, 
  computed: {
      usuariosFiltrados () {
          const bp = this.buscarPor
          if(!bp)
            return this.usuarios
          return this.usuarios.filter(x=>x.nombre.indexOf(bp)>=0||x.texto.indexOf(bp)>=0)
     }
  }
}
</script>
