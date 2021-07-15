<template>
  <div>
    <h1 class="text-center">Biblioteca Tseyor</h1>
    <p class="text-center mx-auto">
      Todos los contenidos de la biblioteca están basados en las comunicaciones
      telepáticas mantenidas con los Guías Estelares y las actividades del grupo
      Tseyor.
    </p>
    <divider />
    <Grid class="grid-cols-fit-w-48 text-center w-auto">
      <NLink
        v-for="item of secciones"
        :key="item.url"
        :to="item.url"
        class="surface card flex flex-col hover:bg-yellow-50 dark:hover:bg-gray-dark-700 transition duration-200 items-center
                border-gray border rounded p-5"
      >
        <div
          class="text-gray w-auto text-5xl h-20 icon transition duration-200"
        >
          <i v-if="item.icon" :class="item.icon" />
          <div
            class="svg-container flex"
            v-else-if="item.svg"
            v-html="item.svg"
          />
        </div>
        <h2 class="transition duration-200 text-xl text-center uppercase">
          {{ item.nombre }}
        </h2>
        <p class="text-center text-sm mt-2">{{ item.descripcion }}</p>
      </NLink>
    </Grid>
    <divider />
  </div>
</template>

<script>
import ufo from "~/assets/svg/icons/ufo.svg?raw";
export default {
  data() {
    return {
      secciones: [
        {
          nombre: "Libros",
          url: "/libros",
          icon: "fas fa-book",
          descripcion:
            "Más de 300 libros en PDF con contenidos generados a partir del mensaje de las estrellas"
        },
        {
          nombre: "Comunicados Recientes",
          url: "/comunicados",
          svg: ufo,
          descripcion:
            "Comunicaciones telepáticas más recientes con los Guías Estelares"
        },
        {
          nombre: "Archivo de Comunicados",
          url: "/biblioteca/comunicados",
          svg: ufo,
          descripcion: "Archivo con más 1400 comunicados"
        },
        {
          nombre: "Audios",
          url: "/audios",
          icon: "fas fa-music",
          descripcion:
            "Talleres y meditaciones guiadas, cuentos, reflexiones, música..."
        },
        {
          nombre: "Vídeos",
          url: "/videos",
          icon: "fab fa-youtube",
          descripcion: "Vídeos de nuestro grupo, del canal de Youtube"
        },
        {
          nombre: "Cuadernos",
          url: "/cuadernos",
          icon: "far fa-clipboard",
          descripcion:
            "Manuales de trabajo con meditaciones, textos seleccionados, etc."
        }
      ]
    };
  }
};
</script>

<style scoped>
.svg-container >>> svg {
  width: 3.7rem;
  fill: currentColor;
  stroke: currentColor;
}
.card:hover .icon {
  @apply text-orange-400;
  transform: scale(1.05);
}
.card:hover h2 {
  @apply text-orange-900;
}
</style>
