<template>
    <div class="comment flex w-full group">
        <Avatar :user="comentario.autor" :name="comentario.nombre"
            class="text-3xl w-8 h-8 sm:w-16 sm:h-16 mr-2 sm:mr-3 lg:mr-5" />

        <div class="w-full">
            <Card class="w-full p-1 xs:p-2 sm:p-4">
                <div class="flex justify-start items-baseline text-xs lg:text-sm text-blue-gray">
                    <NLink v-if="comentario.autor && comentario.autor.id" :to="'/usuarios/' + comentario.autor.id" class="font-bold mb-1">
                        {{
                                mostrarNombre(comentario.autor)
                        }}</NLink>
                    <div v-else class="font-bold mb-1">{{ comentario.nombre }}</div>
                    <span class="mx-2 opacity-50">•</span>
                    <span class="text-xs">
                        {{ $dayjs(comentario.updatedAt).fromNow() }}
                    </span>
                </div>
                <div class="text-justify text-sm lg:text-base" v-html="$mdToHtml(comentario.texto)" />
                <div v-for="img, index of comentario.adjuntos" :key="index" class="my-2">
                    <nuxt-img :src="img.url" class="w-full" sizes="sm:100vw" />
                </div>
            </Card>

            <div class="mt-2 flex justify-start items-center text-xs px-2 select-none">
                <a v-if="likeing" class="mr-5 cursor-pointer" @click="dislike">
                    <icon icon="fas fa-heart" class="text-red" />
                    <span>{{ likesCount }}</span>
                </a>
                <a v-else class="mr-5 cursor-pointer" @click="like">
                    <icon icon="far fa-heart" />
                    <span v-if="likesCount">{{ likesCount }}</span>
                </a>


                <span v-if="!likeing"
                    class="mr-5 opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                    @click="like">Me gusta</span>

                <span class="ml-auto opacity-0 transition transition-duration-200 group-hover:opacity-100 link cursor-pointer"
                    @click="$emit('responder', comentario.id)">Responder</span>
            </div>
        </div>
    </div>
</template>

<script>
import likes from "@/mixins/likes.js";
export default {
    mixins: [likes],
    props: {
        comentario: {
            type: Object,
            required: true,
        }
    },
    computed: {
        uid() {
            return `/comentarios/${this.comentario.id}`
        },
        ccollection() {
            return 'comentarios'
        }
    },
    methods: {
        mostrarNombre(user) {
            return user.nombreSimbolico || user.username
        },

    }
}
</script>