<template>
  <div class="max-w-5xl">
    <h1>Recursos Tseyor</h1>
    <Card class="p-6">
      <Grid class="grid-cols-fill-w-60">
          <NLink
          v-for="elem of $store.getters.buildRoutes(secciones)"
            :key="elem.href" 
            :to="elem.href"
            :class="
              'place-items-center flex w-full hover:bg-white dark:hover:bg-black rounded ' +
                elem.bg
            "
          >
            <div
              :class="
                'icon text-5xl flex justify-center transition-all duration-200 opacity-60 ' +
                  elem.bgIcon
              "
              style="min-width: 6rem"
            >
             <icon v-if="elem.icon" :icon="elem.icon" />
            </div>
            <div class="title-right transition-all duration-200">
              <div class="title transition duration-200 text-xl">
                {{ elem.name }}
              </div>
              <p class="description transition duration-200 text-gray">
                {{ elem.description }}
              </p>
            </div>
          </NLink>
      </Grid>
    </Card>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      secciones: [
        "/biblioteca",
        "/audios",
         "/libros",
         "/biblioteca/comunicados",
         "/videos",
          "/cuadernos",
          "/radio",
          "/muul",
          "/redes",
          "/archivos",
          "/reuniones",
          "/recursos/listados",
          "/recursos/estatutos",
          "/recursos/normativas",
          "/recursos/legal",
      ],
      // SEO:
      title: 'Recursos',
      description: 'Listado de recursos de Tseyor',
      image: 'imagen_a_definir'
    };
  }
};
</script>
