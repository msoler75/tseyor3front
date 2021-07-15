<template>
  <div>
    <h1>Visita Guiada</h1>
    <Grid>
      <Card v-for="item of presentaciones" :key="item.href" :data="item" />
    </Grid>
  </div>
</template>

<script>
export default {
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
    };
  },
};
</script>