<template>
  <div class="max-w-3xl">

    <Card class="px-5 py-7 w-full items-center">
        <nuxt-img src="/assets/images/ong-logo.jpg" sizes="100% sm:709px" class="mx-auto mb-6" />
   
      <h1 class="text-center">ONG Mundo Armónico Tseyor</h1>
      <blockquote>
        <p>
          Se está preparando un gran cambio y ello comportará también grandes
          dificultades. Nuestro grupo, el grupo Tseyor, pondrá su granito de
          arena para paliarlas.
        </p>
      </blockquote>
      <blockquote>
        <p>
          Habéis recibido cantidad de información; muchos estómagos necesitan de
          dicho alimento espiritual. Poneros de acuerdo con ese figurado eje
          central que es la universidad, para preparar trabajos, escritos,
          monografías... Ahí también está una parte importante de la ayuda
          humanitaria.
        </p>
      </blockquote>
    </Card>

    <Grid class="my-7 text-center">
          <Card class="px-5 py-7">
              <h3>Muular Electrónico</h3>
              <PLink to="/muular" class="btn mt-auto">Acceso al Muular Electrónico</PLink>
              <p class="text-diminished mt-4"><icon icon="info-circle"/> Información sobre el muular</p>
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
          <li><icon icon="check-circle" class="rounded-full text-blue-400 mr-3"/>...</li>
        </ul>
             <section class="text-center mt-3 mb-8">
          <PLink to="/recursos/estatutos" icon="fas fa-scroll" class="btn">Estatutos de la ONG</PLink>
          </section>
    </Card>

    
    <CardBook landscape :data="{
       id:4,
      title: 'ONG Mundo Armónico Tseyor', 
      texto:'Monografía que recoge todas las informaciones sobre el proceso de creación y desarrollo la ONG Mundo Armónico Tseyor.', 
      imagen: 'imagen1.jpg'}" 
      class="my-7"/>

   

     <Card class="px-5 py-7 w-full my-7 text-center items-center">
        <h2>El Muular</h2>
        <nuxt-img src="/assets/images/muular.jpg"/>
        
        <p>El muular es el nombre que recibe la moneda de intercambio de bienes y servicios dentro de la comunidad TSEYOR.</p>
        <section class="p-4">
          <PLink to="/muular" icon="fas fa-question-circle" class="btn">Saber Más</PLink>
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
