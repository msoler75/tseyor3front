<template>
    <div class="flex flex-col space-y-6" :class="vertical ? 'w-80' : 'w-full '">

        <Card class="py-6 px-3 lg:px-5">
            <div class="w-full flex justify-between items-center whitespace-nowrap transition-all duration-200"
                :class="vertical ? 'flex-col space-y-6 text-center' : 'space-x-2 xs:space-x-4 sm:space-x-8'">
                <div class="flex-shrink-0">
                    <img :src="equipo.imagen ? equipo.imagen.url : '/imagenes/equipo.jpg'"
                        class="rounded-full transition-all duration-200" fit="cover"
                        :class="vertical ? 'w-32 h-32' : expanded ? 'w-16 h-16 xs:w-20 xs:h-20 xm:w-24 xm:h-24' : 'w-12 h-12 xm:w-16 xm:h-16 lg:w-24 lg:h-24'" />
                </div>
                <div class="flex-grow flex-shrink whitespace-normal" @click="expanded = !expanded">
                    <div>
                        <div class="font-bold transition-all duration-200"
                            :class="vertical ? 'sm:text-xl lg:text-2xl' : expanded ? 'sm:text-2xl lg:text-3xl' : 'text-lg md:text-xl'">
                            <span v-if="enVistaEquipo">{{ equipo.nombre }}</span>
                            <NLink v-else :to="`/equipos/${equipo.slug}`">{{ equipo.nombre }}</NLink>
                        </div>
                        <div class="text-sm text-diminished">{{ equipo.descripcion }}</div>
                    </div>
                </div>
                <div class="hidden sm:flex" :class="vertical || expanded ? 'flex-col space-y-4' : 'space-x-4'">
                    <div title="miembros" class="flex space-x-1">
                        <div class="w-6 flex justify-center items-center">
                            <icon icon="user" class="text-gray" />
                        </div>
                        <span>{{ numMiembros }}</span>
                        <span v-if="vertical || expanded">miembros</span>
                    </div>
                    <div title="actividades" class="flex space-x-1">
                        <div class="w-6 flex justify-center items-center">
                            <icon icon="hiking" class="text-gray" />
                        </div>
                        <span>{{ equipo.actividades ? equipo.actividades.length : 0 }}</span>
                        <span v-if="vertical || expanded">actividades</span>
                    </div>
                </div>
                <div v-if="!vertical" class="px-1 xs:px-2 xm:px-4 cursor-pointer" @click="expanded = !expanded"
                    title="Expande para ver todos los detalles del equipo">
                    <icon :icon="'chevron-' + (expanded ? 'up' : 'down')" />
                </div>
            </div>
        </Card>

        <Card v-if="vertical || expanded" class="py-6 px-3 w-full lg:px-5">
            <div v-if="soyMiembro" class="flex w-full justify-between items-center"
                :class="vertical ? 'flex-col space-y-5' : ''">
                <div class="italic" :class="vertical ? '' : 'ml-auto'">
                    <Icon icon="check-circle" class="text-green mr-1" />Eres miembro
                </div>
                <button class="btn btn-gray" :class="vertical ? '' : 'ml-auto'" @click="salir">
                    <Icon icon="sign-out-alt" class="mr-1" />Salir del equipo
                </button>
            </div>
            <div v-else class="flex justify-center">
                <Button @click="entrar" class="btn">
                    <Icon icon="door-open" class="mr-2" />Inscríbete
                </Button>
            </div>
        </Card>

        <Card v-if="vertical || expanded" class="py-6 px-3">
            <h3 class="text-base" :class="vertical ? 'text-center' : ''">Actividades</h3>
            <div v-if="equipo.actividades">
                <div v-for="actividad of equipo.actividades" :key="actividad.id">
                    <NLink :to="`/actividades/${actividad.id}`">{{ $ucFirst(actividad.titulo) }}</NLink>
                </div>
            </div>
            <div v-else>No hay actividades</div>

            <h3>
                <Icon icon="hiking" class="mr-3" />Actividades
            </h3>
            <div class="flex flex-col space-y-4">
                <NLink v-for="actividad of equipo.actividades" :key="actividad.id" class="p-3 btn btn-gray"
                    :to="'/actividades/' + actividad.id">
                    {{ actividad.titulo }}
                    <span v-if="actividad.descripcion" class="text-diminished">— {{ actividad.descripcion }}</span>
                </NLink>
            </div>
        </Card>

        <!-- 
        <Card>
        
             <div v-if="carpetaActualId" class="p-5 surface flex flex-col">
          <h3>{{ carpetaActualNombre }}</h3>
          <FilesFolder @loaded="carpetaActual = $event" v-model="carpetaActualId" :idRootFolder="equipo.carpeta.id"
            class="w-full max-w-full h-full overflow-y-auto max-h-[240px]" :droppable="soyCoordinador"
            navigationMode="Embed" iconClass="text-xl" textClass="text-sm" subtextClass="text-xs" boxClass="w-8 mr-2" />
          <div class="flex justify-center mt-2">
            <NLink class="ml-auto text-xs btn btn-gray btn-mini" :to="`${carpetaActual.ruta}`">
              <icon icon="search" />
            </NLink>
          </div>
        </div>

        </Card>
        -->

        <Card v-if="vertical || expanded" class="py-6 px-3">
            <h3 class="text-base" :class="vertical ? 'text-center' : ''">Miembros</h3>
            <div class="flex flex-wrap" v-if="equipo.miembros && equipo.miembros.length">
                <Avatar v-for="user of equipo.miembros" :key="user.id" :user="user" :class="avatarClass" class="m-1" />
            </div>
            <div v-else class="flex flex-col flex-grow justify-center">
                <p class="text-center">No hay miembros</p>
            </div>
            <h3 class="text-base" :class="vertical ? 'text-center' : ''">Coordinadores</h3>
            <div class="flex flex-wrap">
                <Avatar v-for="user of equipo.coordinadores" :key="user.id" :user="user" :class="avatarClass"
                    class="m-1" />
            </div>
        </Card>

    </div>
</template>

<script>
export default {
    props: {
        equipo: {
            type: Object,
            required: false,
            default: null
        },
        vertical: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            numMiembros: 0,
            expanded: false,
            loadedEquipo: null
        }
    },
    async fetch() {
        console.warn('FETCH!')
        if (!this.equipo || !this.equipo.miembros)
            this.equipo = await this.$strapi.count('users', {
                filters: {
                    equipos: {
                        id: {
                            $eq: this.equipo.id
                        }
                    }
                }
            })
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
        cequipo() {
            return this.equipo || this.loadedEquipo
        },
        cimage() {
            let src = this.equipo.imagen
            if (Array.isArray(src)) src = src[0]
            if (src && typeof src === 'object')
                src = src.url
            return src
        },
        avatarClass() {
            return "w-16 h-16";
            if (!this.equipo.miembros)
                return "";
            const n = this.equipo.miembros.length;
            return n < 8 ? "w-16 h-16" : n < 16 ? "w-12 h-12" : n < 64 ? "w-8 h-8" : "w-4 h-4";
        },
        soyMiembro() {
            return this.equipo.miembros && !!this.equipo.miembros.find(x => x.id === this.$strapi.user.id);
        },
        soyCoordinador() {
            return this.equipo.miembros && !!this.equipo.coordinadores.find(x => parseInt(x.id) === this.$strapi.user.id);
        },
        enVistaEquipo() {
            return this.$route.path.match(/^\/equipos\/[^\/]+$/)
        }
    },
    methods: {
        async entrar() {
            return this.$strapi.put(`/equipos/${this.equipo.id}/join`)
                .then(res => {
                    if (res.error) {
                        console.error(res.error);
                        this.$alert("Hubo un error");
                    }
                    else {
                        this.$set(this.equipo, "miembros", res.miembros);
                        this.$set(this.equipo, "coordinadores", res.coordinadores);
                        if (this.soyCoordinador) {
                            this.$alert("Se te ha asignado como miembro coordinador del equipo");
                        }
                    }
                });
        },
        async salir() {
            this.$confirm({
                message: "¿Quieres salir del equipo?",
                yes: "Sí",
                no: "Cancelar",
                confirmed: async () => {
                    return this.$strapi.put(`/equipos/${this.equipo.id}/leave`)
                        .then(res => {
                            if (res.error) {
                                console.error(res.error);
                                this.$alert("Hubo un error");
                            }
                            else {
                                this.$set(this.equipo, "miembros", res.miembros);
                                this.$set(this.equipo, "coordinadores", res.coordinadores);
                            }
                        });
                },
            });
        },
    }
}
</script>