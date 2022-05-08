<template>
      <Card class="p-3">
        <div class="flex items-center whitespace-nowrap">
          <div class="w-14 h-14 mr-5 flex-shrink-0">
            <nuxt-img :src="equipo.imagen ? equipo.imagen.url : '/imagenes/equipo.jpg'" :width="70" :height="70"
              class="w-full h-full rounded-full" fit="cover" />
          </div>
          <div class="flex-shrink pr-4 whitespace-normal">
            <div>
              <div class="font-bold text-lg">
                <NLink :to="'/equipos/' + equipo.slug">{{ equipo.nombre }}</NLink>
              </div>
              <div class="text-sm text-diminished">{{ equipo.descripcion }}</div>
            </div>
          </div>
          <div class="ml-auto flex space-x-4 pr-5">
            <div class="flex flex-col justify-center items-center">
              <span title="miembros">
                <icon icon="user" class="mr-1 text-gray" />
                {{ numMiembros }}
              </span>
            </div>
            <div class="flex flex-col justify-center items-center">
              <span title="actividades">
                <icon icon="hiking" class="mr-1 text-gray" />
                {{ equipo.actividades.length }}
              </span>
            </div>
          </div>
        </div>
      </Card>
</template>

<script>
export default {
    props: {
        equipo: {}
    },
    data() {
        return {
            numMiembros: 0
        }
    },
    async fetch() {
        console.warn('FETCH!')
        this.numMiembros = await this.$strapi.count('users', {
            filters: {
                equipos: {
                    id: {
                        $eq: this.equipo.id
                    }
                }
            }
        })
    },
    computed: {
        cimage() {
            let src = this.equipo.imagen
            if (Array.isArray(src)) src = src[0]
            if (src && typeof src === 'object')
                src = src.url
            return src
        },
    }
}
</script>