<template>
<section>
    <div class="surface w-full">
    <div class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav class="flex flex-wrap justify-center -mx-5 -my-2">
            <div v-for="enlace of enlaces" :key="enlace.href" class="px-5 py-2">
                <a :href="enlace.href" class="text-base leading-6 text-gray-500 hover:text-gray-900 capitalize">
                    {{enlace.nombre}}
                </a>
            </div>
        </nav>
        <div class="flex justify-center mt-8 space-x-6">
            <a v-for="red of redes" :key="red.href" target="_blank" :href="red.href" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Facebook</span>
                <i :class="red.icon" />
            </a>
        </div>
        <section class="mt-8 text-base leading-6 text-center text-gray-400">
           {{copyright}}
        </section>
    </div>
    </div>
</section>
</template>

<script>
export default {
    data() {
        return {
            enlaces: [
                { nombre: 'Portada', href: '/'},
                { nombre: 'ONG', href: '/ong'},
                { nombre: 'Universidad', href: '/universidad'},
                { nombre: 'Contactar', href: '/contactar'},
                { nombre: 'Donde estamos', href: '/mapa'},
            ],
            redes: [
                { href: 'https://facebook.com/tseyor', icon: 'fab fa-facebook'},
                { href: 'https://twitter.com/tseyor', icon: 'fab fa-twitter'},
            ],
            copyright: ' © 2021 TSEYOR'
        }
    }
}
</script>