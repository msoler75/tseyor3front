<template>
    <div class="flex flex-col space-y-4 justify-center sm:mx-auto">
        <template v-if="$strapi.user">
            <div class="text-diminished text-xs">
                <span v-if="suscrito">Pulsa en la campanita para dejar de recibir notificaciones.</span>
                <span v-else>Pulsa en la campanita para recibir las novedades en tu correo.</span>
            </div>
            <button class="btn btn-warning max-w-[280px]" @click="onclick">
                <icon :icon="icon" class="mr-3" />
                <span v-if="suscrito">Recibes notificaciones</span>
                <span v-else>{{ label }}</span>
            </button>
            <NLink to="/suscripciones" class="text-xs text-diminished space-x-2"><icon icon="cog"/><span>Editar suscripciones</span></NLink>
        </template>
        <template v-else>
            <div v-if="suscripcion" class="font-bold space-x-3">
                <icon icon="envelope" class="animate-right"/>
                <span>{{ mensajeSuscripcion }}</span>
            </div>
            <form v-else @submit.prevent="onclick" class="w-60 flex flex-col space-y-4">
                <input type="email" placeholder="Correo electrónico" required ref="correo" />
                <div>
                    <input id="condiciones" type="checkbox" required />
                    <label for="condiciones" class="text-xs">
                        He leído y acepto la
                        <NLink to="/privacidad" class="text-orange-500">política de privacidad</NLink>
                    </label>
                </div>
                <Submit v-model="suscribiendose">{{ label }}</Submit>
            </form>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        collection: {},
        contentId: {},
        label: { type: String, required: false, default: 'Suscribirme' }
    },
    data() {
        return {
            generales: ['boletines', 'audios', 'comunicados', 'eventos', 'libros', 'normativas', 'noticias'],
            especificos: ['blogs', 'equipos', 'carpetas', 'comentarios'/*, 'paginas'*/],
            suscripcion: null,
            suscribiendose: false,
            mensajeSuscripcion: 'Verifica tu buzón de correo'
        }
    },
    async fetch() {
        if (this.$strapi.user) {
            let [suscripcion] = await this.$strapi.find('suscripciones', { usuario: this.$strapi.user.id })
            if (!suscripcion)
                suscripcion = await this.$strapi.create('suscripciones', { usuario: this.$strapi.user.id })
            if (suscripcion) {
                this.suscripcion = suscripcion
            }
        }
    },

    computed: {
        suscrito() {
            if (!this.suscripcion) return false
            console.warn('suscrito?', this.collection, this.suscripcion)
            if (!(this.collection in this.suscripcion)) {
                console.warn('not in')
                return false
            }
            if (this.esgeneral) {
                console.warn('generales')
                return this.suscripcion[this.collection]
            }
            console.warn('especificos', this.contentId, this.suscripcion[this.collection])
            return !!this.suscripcion[this.collection].find(x => x.id === this.contentId)
        },
        esgeneral() {
            return this.generales.includes(this.collection)
        },
        collecionValida() {
            if (!this.collection || (this.generales.includes(this.collection) && this.especificos.includes(this.collection))) {
                console.warn(this.collection, 'no válida')
                return false
            }
            return true
        },
        icon() {
            // return 'fas fa-' + (this.suscrito ? 'bell' : 'bell-slash')
            return this.suscrito ? 'fas fa-bell' : 'far fa-bell'
        }
    },
    methods: {
        async guardarSuscripcion() {
            this.suscripcion = await this.$strapi.update('suscripciones', this.suscripcion.id, this.suscripcion)
        },
        onclick() {
            if (this.$strapi.user) {
                if (this.esgeneral) {
                    this.suscripcion[this.collection] = !this.suscripcion[this.collection]
                }
                else {
                    if (this.suscrito) {
                        // eliminamos la suscripción específica
                        const idx = this.suscripcion[this.collection].findIndex(x => x.id === this.contentId)
                        if (idx > -1) this.suscripcion[this.collection].splice(idx, 1)
                    }
                    else {
                        // añadimos la suscripción específica. Basta poner el id
                        this.suscripcion[this.collection].push(this.contentId)
                    }
                }
                this.guardarSuscripcion()
            }
            else {
                this.suscribiendose = true
                this.suscribirmeEmail()
            }
        },
        async suscribirmeEmail() {
            const correo = this.$refs.correo.value
            if (!this.suscripcion) {
                const suscripcion = { correo }
                suscripcion[this.collection] = this.esgeneral ? true : [this.contentId]
                console.warn('SUSCRIPCION', suscripcion, this.collection, this.esgeneral, this.contentId)
                this.suscripcion = await this.$strapi.create('suscripciones', suscripcion)
            }
        },
    }
}
</script>

<style scoped>
.animate-right {
 animation: aright 1.5s;   
 animation-iteration-count: 1;
}
@keyframes aright {
  to {transform: none}
  from {transform: translateX(300px) rotateX(360deg)  }
}

</style>