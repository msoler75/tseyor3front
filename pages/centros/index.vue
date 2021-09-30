<template>
  <div>
    <div class="flex flex-wrap text-center items-stretch justify-center">
      <div v-for="info of infoClases" :key="info.titulo" class="p-2 max-w-sm">
        <Card class="p-5 rounded-xl h-full">
          <icon 
          :icon="info.icon"
          class="mx-auto text-3xl my-2 text-gray"
          />
        <h2>{{info.title}}</h2>
        <p>
          {{info.text}}
        </p>
        </Card>
      </div>
    </div>
    <section class="mt-5 mb-2">
      <section class="flex flex-wrap justify-between text-sm">
        <NLink to="/mapa?centros" class="btn btn-gray">Ver en Mapa</NLink>
        <SearchInput
          v-model="buscarPor"
          class="w-64 mb-5"
          placeholder="Buscar..."
        />
      </section>
      
      <Grid class="grid-cols-fill-w-40">
        <Card
          v-for="centro of centros"
          :key="centro.id"
          class="p-3 text-center"
        >
          <nuxt-img
            :src="centro.imagen.url"
            class="mx-auto mb-3 w-20 h-20 rounded-full"
          />
          <h3>{{ centro.nombre }}</h3>
          <p class="text-lg">{{ getPais(centro.contacto) }}</p>
          <p v-if="centro.contacto&&(centro.contacto.provincia||centro.contacto.poblacion)" class="text-diminished">
            {{ centro.contacto.provincia||centro.contacto.poblacion }}
          </p>
        </Card>
      </Grid>
    </section>
  </div>
</template>

<script>
import countries from "@/assets/js/countries.js"
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi }) {
    const centros = await $strapi.find("centros") 
    return { centros };
  },
  data() {
    return {
      infoClases: [
        {
        icon: 'fas fa-home',
        title: 'Centros Tseyor',
        text: 'Nuestros centros son las Casas Tseyor y Muulasterios Tseyor, que estamos conformando en todo el mundo, y que próximamente darán paso a los Pueblos Tseyor.'
        },
      ],
      buscarPor: "",
      // SEO:
      title: 'Centros',
      description: 'Casas Tseyor y Muulasterios Tseyor',
      image: 'imagen_a_definir'
    };
  },
  methods: {
    getPais(contacto) {
      if(!contacto||!contacto.pais) return ''
      const code = contacto.pais.toUpperCase()
      const pais = countries.find(x=>x.code===code)
      return pais?pais.label:""
    }
  }
};
</script>
