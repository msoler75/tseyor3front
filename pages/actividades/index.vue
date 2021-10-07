<template>
  <div class="max-w-5xl">
    <h1 class="text-center">Actividades</h1>
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
         "/agenda",
            "/eventos",
            "/equipos",
            "/meditar",
            {
              href: "/actividades/guia",
              bg: "p-3 text-blue-800 shadow ring-2 ring-blue-500 bg-light-blue-50 hover:bg-white dark:text-blue-100 dark:hover:text-blue-900",
            },
            "/leer",
            "/telegram-whatsapp",
            "/formularios/experiencias",
            "/muular",
          ],
      // SEO:
      title: 'Actividades',
      description: 'Actividades de los diferentes equipos de Tseyor',
      image: '/imagenes/unidos.jpg'
    };
  }
};
</script>
