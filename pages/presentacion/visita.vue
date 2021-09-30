<template>
  <div>
    <h1>Visita Guiada</h1>
    <Grid>
      <Card v-for="item of presentaciones" :key="item.href" :data="item" />
    </Grid>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      presentaciones: [
        {
          titulo: "Orígenes del grupo Tseyor",
          href: "/presentacion/origenes",
          descripcion: "Cómo se creó el grupo TSEYOR.",
          imagen: "imagen1.jpg",
        },
      ],
      title: 'Visita guiada',
      description: 'Diferentes informaciones audiovisuales sobre Tseyor',
      image: 'imagen_a_definir'
    };
  },
};
</script>