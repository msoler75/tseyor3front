<template>
  <section class="relative px-7 mb-7" contained="no">
    <GridFluid class="gap-4">
      <div class="h-64 md:h-full" :style="bgImage"></div>

      <div class="surface p-5 text-center flex flex-col justify-center">
        <h2 class="my-0">{{ equipo.nombre }}</h2>
        <section class="text-3xl my-5">
          <Icon icon="people-carry" />
        </section>
        <p>{{ equipo.descripcion }}</p>
        <div class="mt-5 h-8 flex justify-center items-center">
          <div v-if="soyMiembro" class="italic">
            <Icon icon="check-circle" class="text-green mr-1" />Eres miembro
          </div>
          <div v-else>
            <Button @click="entrar" class="btn">
              <Icon icon="door-open" class="mr-2" />Inscríbete
            </Button>
          </div>
        </div>
      </div>

      <div class="surface p-5 cols-2 overflow-auto" v-if="equipo.pizarra">
        <div v-html="equipo.textoHTML" />
      </div>

      <div class="surface p-5 overflow-auto" :class="miembros.length > 8 ? 'cols-2' : ''">
        <h3>Miembros</h3>
        <div class="flex flex-wrap" v-if="miembros.length">
          <Avatar
            v-for="user of miembros"
            :key="user.id"
            :data="user"
            :class="avatarClass"
            class="m-1"
          />
        </div>
        <div v-else class="flex flex-col flex-grow justify-center">
          <p class="text-center">No hay miembros</p>
        </div>
        <template v-if="equipo.coordinadores.length">
          <h3>Coordinadores</h3>
          <div class="flex flex-wrap">
            <Avatar
              v-for="user of equipo.coordinadores"
              :key="user.id"
              :data="user"
              :class="avatarClass"
              class="m-1"
            />
          </div>
        </template>
      </div>

      <div v-if="equipo.actividades && equipo.actividades.length" class="surface p-5">
        <h3>
          <Icon icon="hiking" class="mr-3" />Actividades
        </h3>
        <div class="flex flex-col space-y-4">
          <NLink
            v-for="actividad of equipo.actividades"
            :key="actividad.id"
            class="p-3 btn btn-gray"
            :to="'/actividades/' + actividad.id"
          >
            {{ actividad.titulo }}
            <span
              v-if="actividad.descripcion"
              class="text-diminished"
            >— {{ actividad.descripcion }}</span>
          </NLink>
        </div>
      </div>

      <div v-if="carpetaActualId" class="p-5 surface flex flex-col">
        <h3>{{ carpetaActualNombre }}</h3>
        <FilesFolder          
          @loaded="carpetaActual=$event"
          v-model="carpetaActualId"
          :idRootFolder="equipo.carpeta.id"
          class="w-full max-w-full h-full overflow-y-auto max-h-[240px]"
          :droppable="soyCoordinador"
          navigationMode="Embed"
          iconClass="text-xl"
          textClass="text-sm"
          subtextClass="text-xs"
          boxClass="w-8 mr-2"
        />
        <div class="flex justify-center mt-2">
            <NLink class="ml-auto text-xs btn btn-gray btn-mini" :to="`${carpetaActual.ruta}`"><icon icon="search"/></NLink>
        </div>
      </div>

    </GridFluid>

    <section class="mt-7 flex">
      <button v-if="soyMiembro" class="btn btn-gray ml-auto" @click="salir">
        <Icon icon="sign-out-alt" class="mr-1" />Salir del equipo
      </button>
    </section>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import vercontenidomixin from "@/mixins/vercontenido.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [vercontenidomixin, seo],
  middleware: 'logged',
  async asyncData({ app, $strapi, route, $error }) {
    try {
      let contenido = { miembros: [], coordinadores: [] }
        const id = route.params.id
        let [equipo] = await $strapi.find(
          'equipos',
          id.match(/^\d+$/) ? { id } : { slug: id }
        )
        if (!equipo)
          return $error(404, 'Equipo no encontrado')
        contenido.textoHTML = app.$renderMarkdownServer(contenido.pizarra/*, contenido.imagenes*/)
        return { contenido: equipo, equipo }
    }
    catch (e) {
      console.warn(e)
      $error(503)
    }
  },
  data() {
    return {
      carpetaActual: null,
      carpetaActualId: null
    }
  },
  mounted() {
    if(this.equipo.carpeta)
    {
      this.$set(this, 'carpetaActual', this.equipo.carpeta)
      this.carpetaActualId = this.equipo.carpeta.id
    }
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    soyCoordinador() {
      return !!this.equipo.coordinadores.find(x=>parseInt(x.id)===this.$store.getters.loggedInUser.id)
    },
    carpetaActualNombre() {
      if(this.carpetaActual) return 'Archivos'
      return this.carpetaActual.id===this.equipo.carpeta.id?'Archivos':this.carpetaActual.nombre
    },
    miembros() {
      const m = this.equipo.coordinadores
      for (const user of this.equipo.miembros)
        if (!this.equipo.coordinadores.find(x => x.id === user.id))
          m.push(user)
      return m
    },
    avatarClass() {
      if (!this.miembros) return ''
      const n = this.miembros.length
      return n < 8 ? 'w-16 h-16' : n < 16 ? 'w-12 h-12' : n < 64 ? 'w-8 h-8' : 'w-4 h-4'
    },
    bgImage() {
      const imgUrl = this.$img(this.equipo.imagen ? this.equipo.imagen.url : '/imagenes/equipo.jpg', { width: 400, format: 'webp', quality: 70 })
      return {
        backgroundImage: `url('${imgUrl}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    },
    soyMiembro() {
      return !!this.miembros.find(x => x.id === this.$strapi.user.id)
    }
  },
  methods: {
    async entrar() {
      await this.$strapi.$http.$put('/api/equipos/' + this.equipo.id + '/join')
      //await this.$auth.fetchUser()
      // this.$router.app.refresh()  
      this.refresh()
    },
    async salir() {
      await this.$strapi.$http.$put('/api/equipos/' + this.equipo.id + '/leave')
      // this.$router.app.refresh()  
      this.refresh()
    },
    async refresh() {
      // await this.$strapi.fetchUser() // actualizamos los datos del usuario actual y el equipo con sus miembros después de la operación
      const equipos = await this.$strapi.find('equipos', { id: this.equipo.id })
      this.$set(this.contenido, 'users', equipos[0].miembros)
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