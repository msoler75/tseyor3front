<template>
  <div class="max-w-2xl">
    <Card class="p-5 w-full items-center">
   
      <h1 class="text-center">Asociación TSEYOR Centro de Estudios Socioculturales</h1>
      <blockquote>
        <p>
       Fijaros también que hemos procurado unificar todos los criterios
literarios, procuraros las distintas canalizaciones en vuestros respectivos
estamentos tseyorianos: Tseyor Centro de Estudios Socioculturales, en un
primer momento, seguido de la Universidad Tseyor de Granada y también
la ONG Mundo Armónico Tseyor.
        </p>
        <p>
       Hemos añadido literatura suficiente, el conocimiento suficiente, y
más que se os va a dar, y que os vais a ganar a pulso, mediante los
comunicados que recibís por medio de nuestro Chac Mool Puente. 

        </p>
      </blockquote>
      <p>Shilcars, TAP 55</p>
    </Card>

     <Card class="p-5 w-full my-7">
        <h2 class="text-center">Objetivos</h2>
        <ul class="list-disc ml-4">
          <li>Divulgar el mensaje de las estrellas que hemos recibido a través del canal Chac-Mool Puente.</li>
          <li>Ayudar a todos los interesados en un proceso de auto-despertar.</li>
          <li>Promover actividades de intercambios de bienes y servicios a través del muular.</li>
          <li>...</li>
        </ul>
             <section class="text-center mt-3 mb-8">
          <PLink to="/recursos/estatutos" icon="fas fa-scroll" class="btn">Estatutos de la Asociación</PLink>
          </section>
    </Card>

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
      title: 'Tseyor Centro de Estudios',
      description: 'Toda la información sobre la Asociación Tseyor Centro de Estudios Socioculturales',
      image: 'imagen_a_definir'
    }
  }
};
</script>

