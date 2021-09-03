<template>
<section class="relative px-7 mb-7">
  <Config :contained="false"/>

  <GridFluid class="gap-4">
    <div class="h-64 md:h-full" v-if="equipo.imagen&&equipo.imagen.url" :style="bgImage">
    </div>

    <div class="surface p-5 text-center flex flex-col justify-center">
        <h2 class="my-0">
          {{ equipo.nombre }}
        </h2>
      <section class="text-3xl my-5">
        <Icon icon="people-carry" />
      </section>
        <p>
          {{equipo.descripcion}}
        </p>
        <div class="mt-5 h-8 flex justify-center items-center">
          <div v-if="soyMiembro" class="italic"><Icon icon="check-circle" class="text-green mr-1"/> Eres miembro</div>
          <div v-else><Button @click="entrar" class="btn"><Icon icon="door-open" class="mr-2" />Inscríbete</Button></div>
        </div>
    </div>

    <div class="surface p-5" v-if="equipo.pizarra">
      <div v-html="equipo.textoHTML"/>
    </div>

    <div class="surface p-5">
      <h3>Miembros</h3>
      <div class="flex flex-wrap">
        <Avatar v-for="user of equipo.users" :key="user.id" :data="user" :class="avatarClass" class="m-1" />
      </div>
    </div>

    <div v-if="equipo.actividades" class="surface p-5">
      <h3>Actividades</h3>
      <div class="flex flex-col space-y-4">
        <NLink v-for="actividad of equipo.actividades" :key="actividad.id" class="p-3 btn btn-gray" :to="'/actividades/'+actividad.id">{{actividad.titulo}} <span v-if="actividad.descripcion" class="text-diminished"> — {{actividad.descripcion}}</span></NLink>
      </div>
    </div>

  </GridFluid>

  <section class="mt-7 flex">
      <button v-if="soyMiembro" class="btn btn-gray ml-auto" @click="salir" ><Icon icon="sign-out-alt" class="mr-1" /> Salir del equipo</button>
  </section>

</section>
</template>

<script>
import { mapGetters } from "vuex";
import vercontenidomixin from "@/mixins/vercontenido.js";
export default {
  middleware: 'auth', // requiere auth
  mixins: [vercontenidomixin],
  async asyncData({ app, $strapi, route, redirect }) {
    try {
      const id = route.params.id
      const equipos = await $strapi.find('equipos', id.match(/\d+/)?{id}:{slug:id})
      const contenido = equipos[0]
      for(var i=0;i<62;i++)
        contenido.users.push(contenido.users[0])
      contenido.textoHTML = app.$renderMarkdownServer(contenido.pizarra/*, contenido.imagenes*/)
      return { id: contenido.id, contenido, equipo: contenido };
    }
    catch(error)
    {
      console.error(error)
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    avatarClass() {
      if(!this.equipo.users) return ''
      const n = this.equipo.users.length
      return n<16?'w-16 h-16':n<64?'w-6 h-6':'w-4 h-4'
    },
    bgImage() {
      const imgUrl = this.$img(this.equipo.imagen.url, {width: 400, format: 'webp', quality: 70})
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    },
    soyMiembro () {
      return this.equipo.users.find(x=>x.id===this.loggedInUser.id)
    }
  },
  methods: {
     async entrar() {
      await this.$axios.put('/api/equipos/'+this.equipo.id+'/join')
      //await this.$auth.fetchUser()
      // this.$router.app.refresh()  
      this.refresh()
    },
    async salir() {
      await this.$axios.put('/api/equipos/'+this.equipo.id+'/leave')
      // this.$router.app.refresh()  
      this.refresh()
    },
    async refresh() {
      await this.$auth.fetchUser() // actualizamos los datos del usuario actual y el equipo con sus miembros después de la operación
      const equipos = await this.$strapi.find('equipos', {id: this.equipo.id})
      this.$set(this.contenido, 'users', equipos[0].users) 
    }
    /*
    async getEquipos() {
      const response = await this.$axios.get('/api/users/'+this.loggedInUser.id)
      const user = response.data
      return user&&user.equipos?user.equipos.map(x=>x.id):[]
    },
    async updateEquipos(equipos) {
      console.log('update_equipos', equipos)
      const r = await this.$axios.put('/api/users/'+this.loggedInUser.id, {equipos})
      this.$router.app.refresh()     
    },
    async entrar2() {
      const equipos = await this.getEquipos()
      console.log('equipos', equipos)
      const idx = equipos.findIndex(id=>id===this.equipo.id)
      if(idx!==-1)
      {
        this.$router.app.refresh()
        return
      }
      equipos.push(this.equipo.id)
      this.updateEquipos(equipos)   
    },
    async salir2() {
      const equipos = await this.getEquipos()
      console.log('equipos', equipos)
      const idx = equipos.findIndex(id=>id===this.equipo.id)
      if(idx===-1)
      {
        this.$router.app.refresh()
        return
      }
      equipos.splice(idx, 1)
      this.updateEquipos(equipos)     
    }
    */
  }
};
</script>