<template>
  <div class="max-w-5xl">
    <h1>¿Quiénes Somos?</h1>
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
export default {
  data() {
    return {
      secciones: [
            "/presentacion/visita",
             "/guias-estelares",
             "/preguntas_frecuentes",
             "/mapa",
            {
              href: "/cursos",
              bg: "text-yellow-900 shadow ring-2 ring-yellow-500 bg-yellow-200 hover:text-yellow-900 hover:bg-yellow-100 dark:text-yellow-800 dark:hover:text-yellow-900",
            },
            "/organizacion",
            ]
    };
  }
};
</script>
