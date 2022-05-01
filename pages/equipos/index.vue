<template>
  <div class="max-w-3xl">
    <h1>Equipos</h1>
    <section class="flex">
      <div></div>
      <div class="ml-auto">
        <SearchInput v-model="buscarPor" class="w-44 xl:mb-0" placeholder="Buscar equipo..." />
      </div>
    </section>
    <div v-for="equipo of equiposFiltrados" :key="equipo.id" class="mt-4">
      <Card class="p-3">
        <div class="flex items-center whitespace-nowrap">
          <div class="w-14 h-14 mr-5 flex-shrink-0">
            <nuxt-img :src="equipo.imagen ? equipo.imagen.url : '/imagenes/equipo.jpg'" :width="70" :height="70"
              class="w-full h-full rounded-full" fit="cover" />
          </div>
          <div class="flex-shrink pr-4 whitespace-normal">
            <div>
              <div class="font-bold text-lg">
                <NLink :to="'/equipos/' + equipo.slug">{{ equipo.nombre }}</NLink>
              </div>
              <div class="text-sm text-diminished">{{ equipo.descripcion }}</div>
            </div>
          </div>
          <div class="ml-auto flex space-x-4 pr-5">
            <div class="flex flex-col justify-center items-center">
              <span title="miembros">
                <icon icon="user" class="mr-1 text-gray" />
                {{ equipo.miembros }}
              </span>
            </div>
            <div class="flex flex-col justify-center items-center">
              <span title="actividades">
                <icon icon="hiking" class="mr-1 text-gray" />
                {{ equipo.actividades }}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      let { data: equipos, meta, error } = await $strapi.findList(route, {
        populate: ['imagen', 'actividades', 'miembros', 'coordinadores'],
        pagination: {
          limit: 100
        }
      })
      if (!equipos)
        return $error(error && error.status ? error.status : 503)
      equipos = equipos.map(equipo => {
        if (equipo.coordinadores) {
          const m = [...equipo.coordinadores]
          for (const user of equipo.miembros)
            if (!equipo.coordinadores.find(x => x.id === user.id))
              m.push(user)
          equipo.miembros = m.length
        }
        else
          equipo.miembros = 0
        equipo.actividades = equipo.actividades ? equipo.actividades.length : 0
        return equipo
      })
      return { equipos, meta }
    }
    catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: "",
      cargando: false,
      // SEO:
      title: 'Equipos',
      description: 'Listado de los diferentes equipos y Departamentos de Tseyor',
      image: this.$store.getters.getImageFor('equipos')
    };
  },
  computed: {
    equiposFiltrados() {
      if (!this.buscarPor) return this.equipos;
      const fuse = new Fuse(this.equipos.map(x => ({
        ...x, extra: (x.nombre + ' ' + x.descripcion).toLowerCase()
          .replace(/á/, 'a')
          .replace(/é/, 'e')
          .replace(/í/, 'i')
          .replace(/ó/, 'o')
          .replace(/ú/, 'u')
      })), {
        keys: ["nombre", "descripcion", "extra"],
        shouldSort: true,
        threshold: 0.3
      });
      return fuse.search(this.buscarPor).map(({ item }) => item)
    }
  }
}
</script>
