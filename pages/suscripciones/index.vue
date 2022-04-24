<template>
    <div class="flex flex-col items-center justify-center">
        <h1>Suscripciones</h1>
        <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
            <div class="p-3 mb-3 mt-6 text-blue-500">
                <template v-if="usuario">
                    <h2>
                        <icon icon="far fa-user" class="mr-2" />
                        <span>{{ usuario.nombreSimbolico || usuario.username }}</span>
                    </h2>
                </template>
                <template v-else>
                    <h2 class="normal-case">
                        <icon icon="far fa-envelope" class="mr-2" />
                        <span>{{ correo }}</span>
                    </h2>
                </template>
            </div>

            <div v-if="suscripcion">
                <hr class="pt-7"/>
                <h3>Configurar Notificaciones</h3>
                <div class="text-gray text-xs mb-3 col-span-2">
                    <span class="inline-block w-66">{{ descripciones['contenidos'] }}</span>
                </div>
                <div class="flex justify-center">
                    <div class="grid grid-cols-2 gap-2 w-full">
                        <template v-for="coleccion of generales">
                            <span class="capitalize" :key="coleccion">{{ coleccion }}</span>
                            <div :key="coleccion + '-checkbox'">
                                <InputSwitch
                                    v-model="suscripcion[coleccion]"
                                    @click="togglesuscription(coleccion)"
                                />
                            </div>
                        </template>
                    </div>
                </div>

                <div class="flex justify-center">
                    <div class="grid grid-cols-2 gap-2 w-full">
                        <template v-for="coleccion of especificosFiltered">
                            <hr class="col-span-2 mt-5" :key="coleccion + '-hr'" />
                            <h3
                                class="!mt-5 mb-1 col-span-2 capitalize"
                                :key="coleccion + '-title'"
                            >{{ coleccion }}</h3>
                            <div
                                class="text-gray text-xs mb-3 col-span-2"
                                :key="coleccion + '-desc'"
                            >
                                <span class="inline-block w-66">{{ descripciones[coleccion] }}</span>
                            </div>
                            <div
                                v-if="!suscripcion[coleccion]||!suscripcion[coleccion].length"
                                class="col-span-2"
                                :key="coleccion"
                            >
                                <div class="pb-1 text-gray">(no hay {{ coleccion }})</div>
                            </div>
                            <template v-else v-for="item of suscripcion[coleccion]">
                                <div :key="coleccion + '-' + item.id">
                                    <NLink
                                        :to="item.uid ? item.uid : `/${coleccion}/${item.slug || item.id}`"
                                        class="capitalize"
                                    >{{ item.ruta || item.nombre || item.titulo || item.uid }}</NLink>
                                </div>
                                <div :key="coleccion + '-' + item.id + '-checkbox'">
                                    <InputSwitch
                                        v-model="item.id"
                                        @click="togglesuscription(coleccion, item.id)"
                                    />
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    middleware: 'suscribed',
    async asyncData({ route, $strapi, store, $error }) {
        try {
            const {correo, codigo} = route.query
            console.warn('query', route.query)
            const _user = !correo ? store.state.user : null
            console.warn('user', _user, 'correo', correo)
            let suscripcion = null
            try {
                suscripcion = await $strapi.$http.$post(
                    '/suscripciones/my',
                _user ? { usuario: _user.id } : { correo, codigo }
            )
            } catch (e) {
                if(e.response&&!e.response.size)
                suscripcion = null
            }
            if (!suscripcion) {
                if (_user) suscripcion = await $strapi.create(
                    'suscripciones',
                    { usuario: _user.id }
                )
                if (!suscripcion)
                    return $error(404, 'Suscripción no encontrada')
            }
            return { usuario: _user, _user, _user: !!_user, correo, suscripcion };
        }
        catch (e) {
            $error(503)
        }
    },
    data() {
        return {
            generales: ['boletines', 'audios', 'comunicados', 'eventos', 'libros', 'normativas', 'noticias'],
            especificos: ['blogs', 'equipos', 'carpetas', 'comentarios'/*, 'paginas'*/],
            soloParaRegistrados: ['equipos', 'carpetas'],
            tienenUrl: ['blogs', 'equipos'],
            descripciones: {
                contenidos: 'Notificar cuando hay nuevos contenidos',
                blogs: 'Notificar cuando se publica un artículo del blog',
                carpetas: 'Notificar cuando se añaden archivos a la carpeta',
                comentarios: 'Notificar cuando hay nuevos comentarios en un hilo de conversación',
                equipos: 'Notificar cuando hay publicaciones o reuniones en el equipo',
                paginas: 'Notificar cuando hay cambios en la página'
            },
            timer: null
        }
    },
    computed: {
        permitido() {
            return this._user || this.$route.query.correo
        },
        especificosFiltered() {
            return this.especificos.filter(x => this._user || !this.soloParaRegistrados.includes(x))
        }
    },
    methods: {
        async togglesuscription(coleccion, id) {
            console.log('togglesuscription', coleccion, id)
            if (this.generales.includes(coleccion)) {
                console.log('generales:', coleccion)
                this.suscripcion[coleccion] = !this.suscripcion[coleccion]
            }
            else {
                // eliminamos la suscripción específica
                const idx = this.suscripcion[coleccion].findIndex(x => x.id === id)
                console.log(id, idx)
                if (idx > -1) this.suscripcion[coleccion].splice(idx, 1)
            }
            this.guardarSuscripcion()
        },
        guardarSuscripcion() {
            console.log('guardar suscripciones')
            clearTimeout(this.timer)
            this.timer = setTimeout(async function () {
                console.log('guardando suscripciones...')
                await this.$strapi.update('suscripciones', this.suscripcion.id, this.suscripcion)
            }.bind(this), 3000)
        },
    }
}
</script>