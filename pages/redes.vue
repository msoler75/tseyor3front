<template>
  <div>
    <h1>Tseyor en Redes Sociales</h1>
    <divider />
    <Grid class="grid-cols-fill-w-80">
      <Card
        v-for="pagina of paginas"
        :key="pagina.href"
        class="p-4 flex-row"
      >
        <div class="mr-5 flex items-center">
          <i :class="'text-5xl mr-6 fab fa-' + dameRed(pagina.href)" />
           <h2 class="text-xl">{{ pagina.nombre }}</h2>
        </div>
          <div class="mt-auto flex w-full items-end justify-end">
            <a target="_blank" :href="pagina.href" class="btn">
              <icon icon="link" class="mr-2" /> Visitar
            </a>
          </div>
      </Card>
    </Grid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      redes: [
        "facebook text-blue-600",
        "twitter text-light-blue-400",
        "instagram text-gray-400",
        "youtube text-red"
      ],
      paginas: [
        {
          nombre: "Página principal de Tseyor en Facebook",
          href: "https://facebook.com/tseyor"
        },
        {
          nombre: "Tseyor Lanzarote",
          href: "https://www.facebook.com/Tseyor-Lanzarote-839961976187688"
        },
        {
          nombre: "Muulasterio Tseyor La Libélula",
          href: "https://www.facebook.com/muulasterio.tseyor.la.libelula"
        },
        {
          nombre: "@TSEYOR en   Twitter",
          href: "https://www.twitter.com/TSEYOR"
        },
        {
          nombre: "Tseyor Vídeos",
          href: "https://www.youtube.com/user/TseyorVideos"
        }
      ]
    };
  },
  methods: {
    dameRed(url) {
      for (const red of this.redes)
        if (url.search(red.replace(/\s.*$/, "")) > -1) return red;
      return "";
    }
  }
};
</script>
