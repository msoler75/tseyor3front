<template>
  <div class="max-w-5xl">
    <h1>Publicaciones</h1>
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
       {
              href: "/novedades",
              noCurrent: true,
              hideInSidebar: true
            },
            "/noticias",
            "/comunicados",
            { 
              noCurrent: true,
              href: "/libros",
            },
            "/blogs",
            "/boletines"
      ]
    };
  }
};
</script>
