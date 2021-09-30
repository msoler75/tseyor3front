<template>
  <div class="max-w-2xl">
    <Card class="p-5 w-full items-center">
      <h1 class="text-center">
        Ágora del Junantal
      </h1>
      <blockquote>
        <p>
          Efectivamente, Ágora del Junantal es, en primer lugar, la sala donde
          nos reuniremos para debatir en asamblea soberana todas las cuestiones
          que afecten al colectivo, donde impartiremos los cursos pertinentes,
          donde se trabajarán los talleres, en este caso el 5º Taller Las
          Sandalias, de nuestra amada hermana Noiwanak…
        </p>
        <p class="text-right">Melcor, 699</p>
      </blockquote>
    </Card>
    

    <Card class="p-5 w-full my-7">
      <h2 class="text-center">Funciones</h2>
      <ul class="list-disc ml-4">
        <li>...</li>
      </ul>
      <section class="text-center mt-3 mb-8">
        <PLink to="/recursos/normativas" icon="fas fa-balance-scale" class="btn"
          >Normativas</PLink
        >
      </section>
    </Card>

    <CardBook landscape :data="{
       id:4,
      title: 'Ágora del Junantal', 
      texto:'Monografía que recoge todas las informaciones sobre el proceso de creación y desarrollo del Ágora del Junantal.', 
      imagen: 'imagen2.jpg'}" 
      class="my-7"/>

    <Card class="p-5 w-full my-7 text-center items-center">
      <h2>Recursos</h2>
      <ul>
        <li>Listado de socios</li>
        <li>Actas</li>
        <li>...</li>
      </ul>
    </Card>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      // SEO:
      title: 'Ágora del Junantal',
      description: 'Asamblea soberana de la organización Tseyor',
      image: 'imagen_a_definir'
    }
  }
}
</script>
