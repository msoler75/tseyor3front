<template>
    <div class="flex flex-col items-center justify-center">
        <Card class="w-full max-w-lg p-2 sm:py-5 sm:px-7 text-center">
            <div class="p-3 mb-3">
                <h2 class="normal-case">
                    <icon icon="far fa-envelope" class="mr-2" />
                    <span>{{ suscripcion ? suscripcion.correo : '' }}</span>
                </h2>
            </div>
            <div class="text-xl font-bold p-4 space-x-4">
                <icon v-if="correoValidado" icon="check" class="text-green-500" />
                <icon v-else icon="times" class="text-red-500" />
                <span>{{ mensajeValidacion }}</span>
            </div>
        </Card>
    </div>
</template>

<script>
export default {
    middleware: 'suscribed',
    async asyncData({ $strapi, store, route, $error }) {
        try {
            let suscripcion = null;
            let mensajeValidacion = ''
            let correoValidado = false
            const hash = route.query.hash
            if (!hash)
                return $error(400, "Enlace no válido")
            try {
                suscripcion = await $strapi.$http.$post(`/suscripciones/validate/${hash}`)
                mensajeValidacion = 'Tu suscripción se ha realizado correctamente'
                correoValidado = true
            }
            catch (err) {
                mensajeValidacion = err.message
            }

            return { correoValidado, mensajeValidacion, suscripcion };
        }
        catch (e) {
            console.warn(e)
            $error(503)
        }
    }
}
</script>