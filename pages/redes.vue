<template>
  <div>
    <h1>Tseyor en Redes Sociales</h1>
    <divider />
    <Grid class="grid-cols-fill-w-80">
      <Card
        v-for="pagina of paginas"
        :key="pagina.enlace"
        class="p-4 flex-row"
      >
        <div class="mr-5 flex items-center">
          <icon :icon="'fab fa-' + dameRed(pagina.enlace).icon" class="text-5xl mr-6" :class="dameRed(pagina.enlace).class" />
           <h2 class="text-xl">{{ pagina.titulo }}</h2>
        </div>
          <div class="mt-auto flex w-full items-end justify-end">
            <a target="_blank" :href="pagina.enlace" class="btn">
              <icon icon="link" class="mr-2" /> Visitar
            </a>
          </div>
      </Card>
    </Grid>
  </div>
</template>

<script>
export default {
  async asyncData({$strapi, $error}) {
    try {
      const paginas = await $strapi.find('redes')
      return { paginas }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      redes: {
        facebook: "text-blue-600",
        twitter: "text-light-blue-400",
        instagram: "text-gray-400",
        youtube: "text-red"
      }
    };
  },
  methods: {
    dameRed(url) {
      for (const red in this.redes)
        {
          const parts = red.split(" ")
          if(url.indexOf(red)>-1)
            return {icon: red, class: this.redes[red]}
        }
      return {icon:'facebook', class:''}
    }
  }
};
</script>
