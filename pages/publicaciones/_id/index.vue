<template>
    <section class="flex flex-col space-y-8 items-center" contained="no" background="no" focused>

        <NLink v-if="contenido.autor && $strapi.user && $strapi.user.id === contenido.autor.id"
            class="btn absolute -top-12 right-4 w-12 h-12 flex justify-center items-center rounded-full sm:w-auto sm:h-auto sm:rounded-inherit"
            :to="`/publicaciones/${contenido.id}/editar`">
            <icon icon="edit" />
            <span class="ml-2 hidden sm:inline">Editar</span>
        </NLink>

        <div class="container max-w-[96rem] px-3 sm:px-5 md:px-7">
        <Equipo v-if="contenido.equipo" :equipo="contenido.equipo"/>
        </div>

        <Contenido :contenido="contenido" @share="viendoCompartir = true"/>

        <!-- share modal -->
        <Comparte v-model="viendoCompartir" />

        <SocialBotones id="social" :uid="uid" :contenido="contenido" @like="like" @dislike="dislike"
            :meGusta="['Notificación', 'Información', 'Personal', 'Descripción'].includes(contenido.tipo)"
            @share="viendoCompartir = true" class="mx-auto max-w-xl my-7 lg:my-16" />

       <!-- comentarios -->
    <section id="comentarios" class="w-full py-12 bg-gray-200 dark:bg-transparent" 
      v-observe-visibility="(isVisible) => { mostrarComentarios = mostrarComentarios || isVisible }">
      <h3 v-if="contenido.comentarios" class="text-center">{{
          contenido.comentarios + ' Comentario' +
          (contenido.comentarios !== 1 ? 's' : '')
      }}</h3>
      <h3 v-else class="text-center">Coméntalo</h3>
      <LazyComentarios v-if="mostrarComentarios" :uid="uid" :contenido="contenido"
        @count="$set(contenido, 'comentarios', $event)" class="mx-auto px-1 xs:px-2 container container-md" />
    </section>

    </section>
</template>

<script>
import vercontenido from "@/mixins/vercontenido.js"
import likes from "@/mixins/likes.js"
import seo from "@/mixins/seo.js"
export default {
    mixins: [vercontenido, likes, seo],
    async asyncData({ route, $strapi, $error }) {
        try {
            const contenido = await $strapi.getContent(route, {
                populate: {
                    equipo: '*'
                }
            })
            if (!contenido)
                return $error(404, 'Publicación no disponible')
            return { contenido, publicacion: contenido };
        }
        catch (err) {
            console.warn(JSON.stringify(err))
            $error(503)
        }
    }
};
</script>

<style scoped>
@screen md {
    .grid {
        grid-template-columns: 1fr 2fr;
    }
}

@screen lg {
    .grid {
        grid-template-columns: 1fr minmax(500px, 2fr);
    }
}

@screen xl {
    .grid {
        grid-template-columns: 3fr minmax(500px, 5fr) 2fr;
        grid-template-rows: 90px 1fr;
    }
}

.h-image {
    @apply h-24;
}

@screen sm {
    .h-image {
        height: 40vh;
        max-height: 280px;
        min-height: 80px;
    }
}

.evento-wrapper {
    background-size: 10px 10px;
    background-image: repeating-linear-gradient(45deg,
            transparent 0,
            #444cf7 1px,
            transparent 0,
            transparent 50%);
}

.imagenes {
    max-height: 80vh
}
</style>