<template>
  <div class="max-w-2xl">
    <Card class="p-5 w-full items-center">
      <h1 class="text-center">
        Comisión de Tseyor
      </h1>
      <blockquote>
        <p>
          ... (pendiente)
        </p>
        <p class="text-right">........</p>
      </blockquote>
    </Card>

    <Card class="p-5 w-full my-7">
      <h2 class="text-center">Funciones</h2>
      <ul class="list-disc ml-4">
        <li>...</li>
      </ul>
      <section class="text-center mt-3 mb-8">
        <PLink to="/recursos/estatutos" icon="fas fa-scroll" class="btn">Ver Estatutos</PLink>
        >
      </section>
    </Card>

      <CardLibro landscape :data="{
       id:4,
      title: 'Comisión de Tseyor', 
      texto:'Monografía que recoge todas las informaciones sobre el proceso de creación y desarrollo de la Comisión de Tseyor.', 
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
      title: 'Comisión de Tseyor',
      description: 'Comisión es la consciencia de Tseyor',
      image: 'imagen_a_definir'
    }
  }
}
</script>