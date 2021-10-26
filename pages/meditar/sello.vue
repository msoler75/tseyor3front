<template>
    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <!-- Sin breadcrumb -->
    <div class="h-screen w-screen fixed t-0 l-0 flex py-7 justify-center items-center bg-white" ref="sdiv"
    contained="no" background="no" breadcrumb="no">
        <nuxt-img src="/imagenes/sello.png" fit="cover" height="100%" />
    </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
    mixins: [seo],
    asyncData() {
        return {timer: null}
    },
    mounted() {
      this.$refs.sdiv.addEventListener('mousemove', this.activate)
      this.$refs.sdiv.addEventListener('touch', this.activate)
    },
    methods:
    {
        activate() {
            const that = this
            this.$store.commit('setHideMenus', false)
            clearTimeout(this.timer)
            this.timer = setTimeout(function() {
                that.$store.commit('setHideMenus', true)
            }, 5000)
        }
    },
    data() {
        return {
            // SEO:
            title: 'Sello de Tseyor',
            description: 'Visualización del sello para la meditación de mente en blanco',
            image: 'imagen_a_definir'
        }
    }
}
</script>