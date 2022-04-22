<template>
    <div class="comment">
        <Card class="w-full p-1 xs:p-2 sm:p-4">
            <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                <NLink v-if="data.autor && data.autor.id" :to="'/usuarios/' + data.autor.id" class="font-bold mb-1">{{
                        mostrarNombre(data.autor)
                }}</NLink>
                <div v-else class="font-bold mb-1">{{ data.nombre }}</div>
                <span class="mx-2 opacity-50">•</span>
                <span class="text-xs">
                    {{ $dayjs(data.updatedAt).fromNow() }}
                </span>
            </div>
            <div class="text-justify text-sm lg:text-base" v-html="$renderMarkdownServer(data.texto)" />
            <div v-for="img, index of data.adjuntos" :key="index" class="my-2">
                <nuxt-img :src="img.url" class="w-full" sizes="sm:100vw" />
            </div>
        </Card>

        <div v-if="$strapi.user" class="mt-2 flex justify-start items-center text-xs px-2">
            <a v-if="comentario.likes && comentario.likes.length" class="mr-5 cursor-pointer"
                @click="IlikeIt(comentario) ? dislike(comentario.id) : {}">
                <icon icon="fas fa-heart" class="text-red" />
                {{ comentario.likes.length }}
            </a>
            <a v-else class="mr-5 cursor-pointer" @click="IlikeIt(comentario) ? {} : like(comentario.id)">
                <icon icon="far fa-heart" />
            </a>

            <span v-if="!IlikeIt(comentario)"
                class="mr-5 opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                @click="like(comentario.id)">Me gusta</span>

            <span class="opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                @click="onResponder(comentario.id)">Responder</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        uid() {
            return `/comentarios/${data.id}`
        }
    },
    methods: {
        mostrarNombre(user) {
            return user.nombreSimbolico || user.username
        },
    }
}
</script>