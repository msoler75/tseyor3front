<template>
  <div>
    <section class="mb-5">
      <NLink class="btn btn-gray" :to="'/equipos/' + actividad.equipo.id"
        ><Icon icon="chevron-left" class="mr-3" />{{
          actividad.equipo.nombre
        }}</NLink
      >
    </section>

    <GridFluid class="gap-6">
    
    <div class="p-5 surface flex flex-col justify-center text-center">
      <h1>
        {{ actividad.titulo }}
      </h1>
      <p >{{ actividad.descripcion }}</p>
    </div>

  <div class="p-5 surface text-center flex flex-col justify-center">
      <h3>Horarios</h3>
      <Horario
        v-for="horario of actividad.horarios"
        :key="horario.id"
        class="my-1 text-center"
        :data="horario"
      />
  </div>

      
      <div class="p-5 surface text-center" v-if="actividad.reuniones&&actividad.reuniones.length">
        <h3 >Últimas Reuniones</h3>
        {{actividad.reuniones}}
      </div>

      <div class="p-5 surface text-center flex flex-col justify-center" v-if="actividad.sala">
        <h3 >Sala virtual</h3>
        <strong class="my-5">
          {{actividad.sala.nombre}}
          </strong>

          <NLink class="btn w-auto mx-auto" :to="'/salas/'+actividad.sala.id">Acceder</NLink>
      </div>

      <div class="p-5 surface text-center flex flex-col justify-center">
          <p>Ahora puedes seguir esta actividad y recibirás las notificaciones.</p>
      <button class="btn w-auto mx-auto">Seguir</button>
      </div>
    </GridFluid>
  </div>
</template>

<script>
import vercontenidomixin from '@/mixins/vercontenido.js'
export default {
  mixins: [vercontenidomixin],
  async asyncData ({ $strapi, route }) {
    const id = route.params.id
    const actividades = await $strapi.find(
      'actividades',
      id.match(/\d+/) ? { id } : { slug: id }
    )
    const contenido = actividades[0]
    return { contenido, actividad: contenido }
  }
}
</script>
