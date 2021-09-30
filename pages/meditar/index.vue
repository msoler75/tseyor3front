<template>
    <section>
        <section  class="flex flex-col items-center my-7">
        <h1 class="text-center">Meditar</h1>
        <blockquote>
            <p>
            Olvidarnos del pensamiento racional, dejando de pensar,
únicamente eso. En este punto, cuando uno deja de pensar empieza a
abrirse este “tercer ojo” del conocimiento intuitivo, aparecen en nuestra
mente luces, colores… Aparece la imaginación creativa. En ese momento
es cuando se produce la meditación porque la meditación es todo lo
contrario al pensamiento. 
            </p>
            <p class="text-right">Shilcars</p>
        </blockquote>

        </section>

        <Grid class="text-center">
            <Card v-for="item of items" :key="item.href" :data="item"/>
        </Grid>

    </section>
</template>

<script>
import radioLogo from "~/assets/svg/radio-tseyor.svg?data";
import seo from '@/mixins/seo.js'
export default {
    mixins: [seo],
    data() {
        return {
            items: [
                {
                    imagen: 'imagen1.jpg',
                    titulo: 'Guía para meditar',
                    descripcion: 'Puedes ver nuestra guía rápida para la meditación',
                    href: '/meditar/guia'
                },
                {
                    imagen: 'imagen2.jpg',
                    titulo: 'Audios de Tseyor',
                    descripcion: 'Escucha nuestros audios y déjate guiar',
                    href: '/audios'
                },
                {
                    imagen: radioLogo,
                    titulo: 'Radio Tseyor',
                    descripcion: 'Relájate y sintoniza nuestra emisora de radio de meditaciones y talleres',
                    href: '/radio'
                },
                {
                    imagen: 'imagen3.jpg',
                    titulo: 'Taller de Mente en Blanco',
                    descripcion: 'Practica la meditación del sello de Tseyor',
                    href: '/meditar/sello'
                },
                {
                    imagen: 'imagen4.jpg',
                    titulo: 'Libro: La Meditación en Tseyor',
                    descripcion: 'Consulta nuestro libro donde se explican todos los procesos de meditación',
                    href: '/libros/1'
                }
            ],
            // SEO:
            title: 'Meditar',
            description: 'Información sobre la meditación en Tseyor',
            image: 'imagen_a_definir'
        }
    }
}
</script>