<template>
  <div>

    <section class="text-center flex justify-center items-center flex-col">
    <h1>Vídeos Tseyor</h1>

      <div v-for="video of videos" :key="video.src" class="my-6">
        <h3>{{ video.titulo }}</h3>

        <iframe
          :src="video.src"
          width="560"
          height="315"
          frameborder="0"
        ></iframe>
      </div>
    </section>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      videos: [
        {
          titulo: "Curso Holístico Tseyor",
          src: "https://www.youtube.com/embed/AkOZbfGdXbU"
        },
        {
          titulo: "Comunicado y avistamientos en Temuco",
          src: "https://www.youtube.com/embed/O1NdCJncxFY"
        },
        {
          titulo: "Cuentos",
          src:
            "https://www.youtube.com/embed/playlist?list=PLFhMyyl8F1jZ12k4xf6Lr6fhsycX0jZPT"
        },
        {
          titulo: "Universidad Tseyor",
          src:
            "https://www.youtube.com/embed/playlist?list=PLFhMyyl8F1jZZkMAzNyKeK6iaypDb61ft"
        },
        {
          titulo: "Entrevistas",
          src:
            "https://www.youtube.com/embed/playlist?list=PLFhMyyl8F1jbIfjGgD2lkGQk7vdDq7M45"
        },
        {
          titulo: "ONG",
          src:
            "https://www.youtube.com/embed/playlist?list=PLFhMyyl8F1jYLD4d-J1pQZ11ScOPloVGo"
        }
      ],
      // SEO:
      title: 'Vídeos',
      description: 'Principales vídeos de nuestro canal en Youtube',
      image: 'imagen_a_definir'
    };
  }
};
</script>
