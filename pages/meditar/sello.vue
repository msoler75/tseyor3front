<template>
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <!-- Sin breadcrumb -->
    <div
        class="h-screen w-screen fixed t-0 l-0 -mt-10 flex py-7 justify-center items-center bg-white"
        ref="sdiv"
        contained="no"
        background="no"
        breadcrumb="no"
    >
        <nuxt-img src="/imagenes/sello.png" fit="cover" height="100%" />
    </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
    mixins: [seo],
    data() {
        return {
            timer: null,
            startingPath: this.$route.path,
            // SEO:
            title: 'Sello de Tseyor',
            description: 'Visualización del sello para la meditación de mente en blanco',
            image: 'imagen_a_definir'
        }
    },
    mounted() {
        this.$refs.sdiv.addEventListener('mousemove', this.activate)
        this.$refs.sdiv.addEventListener('touch', this.activate)
        this.activate()
    },
    destroy() {
        this.$refs.sdiv.removeEventListener('mousemove', this.activate)
        this.$refs.sdiv.removeEventListener('touch', this.activate)
        console.warn('removemos timer')
        clearTimeout(this.timer)
    }, 
    methods:
    {
        activate() {
            const that = this
            this.$store.commit('setOnlyContent', false)
            clearTimeout(this.timer)
            this.timer = setTimeout(function () {
                if (that.$route.path == that.startingPath)
                    that.$store.commit('setOnlyContent', true)
            }, 5000)
        }
    }
}
</script>