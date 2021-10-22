<template>
    <div v-if="localValue" class="ease-in-out transition duration-300 fixed top-0 left-0 z-40 w-screen h-screen flex justify-center items-center backdrop-brightness-50 backdrop-filter backdrop-blur-md"
    @mousedown.self="localValue=false">
        <Card class="dark:outline-white">
            <div v-if="title" class="w-full flex items-center p-3 border-b border-gray-300 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <span class="font-bold flex-grow text-lg text-center">{{title}}</span>
                <span class="transition duration-200 cursor-pointer rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-3xl flex-grow-0 w-8 h-8 ml-auto flex justify-center items-center" @click="localValue=false">&times;</span>
            </div>
            <slot/>
        </Card>
    </div>
</template>

<script>
import vmodel from '~/mixins/vmodel.js'
export default {
    mixins: [vmodel],
    props: {
        title: {}
    }
}
</script>