<template>
<section class="relative px-7 mb-7">
  <Config :contained="false"/>

  <GridFluid class="gap-4">
    <div class="h-64 md:h-full" v-if="equipo.imagen&&equipo.imagen.url" :style="bgImage">
    </div>

    <div class="surface p-5 text-center flex flex-col justify-center">
        <h2 class="my-0">
          {{ equipo.nombre }}
        </h2>
      <section class="text-3xl my-5">
        <Icon icon="people-carry" />
      </section>
        <p>
          {{equipo.descripcion}}
        </p>
    </div>

    <div class="surface p-5" v-if="equipo.pizarra">
      <div v-html="equipo.textoHTML"/>
    </div>

    <div class="surface p-5">
      <h3>Miembros</h3>
      <div class="flex flex-wrap">
        <Avatar v-for="user of equipo.users" :key="user.id" :data="user" :class="avatarClass" class="m-1" />
      </div>
    </div>

    <div v-if="equipo.actividades" class="surface p-5">
      <h3>Actividades</h3>
      <div class="flex flex-col space-y-4">
        <NLink v-for="actividad of equipo.actividades" :key="actividad.id" class="p-3 btn btn-gray" :to="'/actividades/'+actividad.id">{{actividad.titulo}} <span v-if="actividad.descripcion" class="text-diminished"> — {{actividad.descripcion}}</span></NLink>
      </div>
    </div>
  
  </GridFluid>
</section>
</template>

<script>
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {
      const id = route.params.id
      const equipos = await $strapi.find('equipos', id.match(/\d+/)?{id}:{slug:id})
      const contenido = equipos[0]
      for(var i=0;i<62;i++)
        contenido.users.push(contenido.users[0])
      contenido.textoHTML = app.$renderMarkdownServer(contenido.pizarra/*, contenido.imagenes*/)
      return { contenido, equipo: contenido };
    }
    catch(error)
    {
      console.error(error)
    }
  },
  computed: {
    avatarClass() {
      if(!this.equipo.users) return ''
      const n = this.equipo.users.length
      return n<16?'w-16 h-16':n<64?'w-6 h-6':'w-4 h-4'
    },
    bgImage() {
      const imgUrl = this.$img(this.equipo.imagen.url, {width: 400, format: 'webp', quality: 70})
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    }
  }
};
</script>

