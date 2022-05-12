<template>
    <section>
        <div v-if="false" class="surface w-full">
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
                        <icon :icon="red.icon" />
                    </a>
                </div>
                <section class="mt-8 text-base leading-6 text-center text-gray-400">
                {{copyright}}
                </section>
            </div>
        </div>

    <div class="surface bg-gray-50 dark:bg-gray-dark-900 w-full">
        <div class="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div class="grid row-gap-10 mb-8 lg:grid-cols-6">
        <div class="grid grid-cols-2 gap-5 row-gap-8 lg:col-span-4 md:grid-cols-4">
          <div v-for="categoria of categorias" :key="categoria.nombre">
            <p class="font-medium tracking-wide dark:text-gray-300">{{categoria.nombre}}</p>
            <ul class="mt-2 space-y-2">
              <li v-for="enlace of categoria.enlaces" :key="enlace.href">
                <a :href="enlace.href" class="text-gray-500 transition-colors duration-300 hover:text-deep-purple-accent-200">{{enlace.nombre}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="md:max-w-md lg:col-span-2 mt-9 lg:mt-0">
          <span class="text-base font-medium tracking-wide dark:text-gray-300">{{invitacionSuscribirse}}</span>
          <Suscribete collection="boletines" class="min-h-36"/>
          <p class="mt-4 text-sm text-gray-500">
            {{notasSuscribirme}}
          </p>
        </div>
      </div>
      <div class="flex flex-col justify-between pt-5 pb-10 border-t border-gray-600 sm:flex-row">
        <p class="text-sm text-gray-500">
          {{copyright}}
        </p>
        <div class="flex items-center mt-4 space-x-4 sm:mt-0">

            <a v-for="red of redes" :key="red.href" target="_blank" :href="red.href" class="text-gray-500 transition-colors duration-300 hover:text-teal-accent-400">
                <span class="sr-only">Facebook</span>
                <icon :icon="red.icon" />
            </a>
        </div>
      </div>
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
            categorias: [
                { nombre: 'Usuarios',
                    enlaces: [
                        { nombre: 'Portada', href: '/'},
                        { nombre: 'Contactar', href: '/contactar'},
                        { nombre: 'Donde estamos', href: '/mapa'},
                    ]
                },
                { nombre: 'Almacenes',
                    enlaces: [
                        { nombre: 'Portada', href: '/'},
                        { nombre: 'Contactar', href: '/contactar'},
                        { nombre: 'Donde estamos', href: '/mapa'},
                    ]
                },
                { nombre: 'Centros',
                    enlaces: [
                        { nombre: 'ONG', href: '/ong'},
                        { nombre: 'Universidad', href: '/universidad'},
                    ]
                },
                { nombre: 'Organización',
                    enlaces: [
                        { nombre: 'ONG', href: '/ong'},
                        { nombre: 'Universidad', href: '/universidad'},
                    ]
                },
            ],
            redes: [
                { href: 'https://facebook.com/tseyor', icon: 'fab fa-facebook'},
                { href: 'https://twitter.com/tseyor', icon: 'fab fa-twitter'},
            ],
            invitacionSuscribirse: 'Suscríbete para recibir las novedades',
            notasSuscribirme: 'Recibirás nuestros boletines.',
            copyright: ' © 2021 TSEYOR',
        }
    }
}
</script>