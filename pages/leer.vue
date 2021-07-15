<template>
    <section class="w-lg max-w-full mx-auto">
        <section class="flex flex-col items-center text-center">
        <h1>Leer</h1>
        <p>La lectura del mensaje de las estrellas es una de las actividades más importantes en el camino filosófico de Tseyor.</p>
        </section>
        <divider/>

        <Grid class="mx-auto text-center">
            <Card v-for="item of items" :key="item.href" :data="item"/>
        </Grid>
    </section>
</template>


<script>
export default {
    data() {
        return {
            items: [
                {
                    imagen: 'imagen2.jpg',
                    titulo: 'Comunicados de Tseyor',
                    descripcion: 'Lee los comunicados más recientes de nuestros Guías Estelares',
                    href: '/comunicados'
                },
                {
                    imagen: 'imagen1.jpg',
                    titulo: 'Libros',
                    descripcion: 'Puedes visitar nuestra biblioteca y leer los libros de la filosofía de Tseyor',
                    href: '/libros'
                },
                {
                    imagen: 'imagen3.jpg',
                    titulo: 'Blogs',
                    descripcion: 'Lee nuestros artículos de los blogs y conocénos mejor',
                    href: '/blogs'
                },
            ]
        }
    }
}
</script>