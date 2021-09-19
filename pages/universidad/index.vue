<template>
  <div class="max-w-2xl">
    <Card class="px-5 py-7 w-full items-center">
        <nuxt-img src="/imagenes/utg-logo.jpg" sizes="100% xs:320px" class="mx-auto mb-6" />
      <h1 class="text-center">Universidad Tseyor de Granada <span class="text-gray">(UTG)</span></h1>
      <blockquote>
        <p>
          La Universidad Tseyor en Granada cuidará de todo el patrimonio bibliográfico de Tseyor, del presente y del futuro patrimonio que se generará en estos años venideros, que será mucho patrimonio. Y, por lo tanto, habrá que darle el cauce adecuado para la debida organización y mantenimiento de la pureza de los mensajes transmitidos, velando para que los mismos no puedan ser modificados ni alterados.
        </p>
      </blockquote>
      <blockquote>
        <p>
          La Universidad Tseyor de Granada podrá incluir entre sus archivos trabajos especializados en diferentes temas, que se vayan generando, ya sea a nivel científico, tecnológico, filosófico, de salud, alimentacion etc.., que los distintos miembros de Tseyor vayan recopilando, vayan generando. Y, a través de la bondan que anida en sus corazones, sepan depositarlo con la total confianza en estos archivos que respetaran siempre la integridad de los trabajos que se hayan realizado.
        </p>
      </blockquote>
      <p class="text-right">Shilcars, Comunicado interdimensional 429</p>
    </Card>

    <Grid class="my-7 text-center">
          <Card class="px-5 py-7">
              <h3>Departamentos de la UTG</h3>
              <PLink to="/universidad/departamentos" class="btn mt-auto">Listado de Departamentos</PLink>
              <p class="text-diminished mt-4"><icon icon="info-circle"/> Listado completo de los equipos</p>
          </Card>
          <Card class="px-5 py-7">
              <h3>Donar</h3>
              <PLink to="/donar" class="btn mt-auto" icon="fas fa-donate">Apóyanos</PLink>
              <p class="text-diminished mt-4"><icon icon="info-circle"/> Nuestros proyectos</p>
          </Card>
    </Grid>

     <Card class="px-5 py-7 w-full my-7">
        <h2 class="text-center">Objetivos</h2>
        <ul class="list-none ml-6">
          <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Divulgar el mensaje de las estrellas que hemos recibido a través del canal Chac-Mool Puente.</li>
          <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Ayudar a todos los interesados en un proceso de auto-despertar.</li>
          <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>Promover actividades de intercambios de bienes y servicios a través del muular.</li>
          <li>...</li>
        </ul>
        <section class="text-center mt-3 mb-8">
          <PLink to="/recursos/estatutos" icon="fas fa-scroll" class="btn">Estatutos de la UTG</PLink>
          </section>
    </Card>

    
     <CardBook landscape :data="{
      id:5,
      title: 'La Universidad Tseyor de Granada', 
      texto:'Monografía que recoge todas las informaciones sobre el proceso de creación y desarrollo la Universidad Tseyor de Granada.', 
      imagen: 'imagen2.jpg'}" 
      class="my-7"/>

     <Card class="px-5 py-7 w-full my-7 text-center items-center">
        <h2>Experiencias</h2>
        <p>Comparte tus experiencias de meditación, sueños, extrapolaciones y trabajos de campo.</p>
        <section class="p-4 mt-5">
          <PLink to="/muular" icon="fas fa-edit" class="btn">Formulario de Experiencias</PLink>
          </section>
    </Card>

    <Card class="px-5 py-7 w-full my-7 text-center items-center">
        <h2>Recursos</h2>
        <ul>
          <li>Listado de socios</li>
          <li>Actas</li>
          <li>...</li>
        </ul>
    </Card>


  </div>
</template>
