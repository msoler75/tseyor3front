<template>
    <div style="h-screen w-screen fixed t-0 l-0" class="flex py-7 justify-center items-center bg-white" ref="sdiv">

    <!-- Sin padding -->
    <!-- No tiene imagen de fondo -->
    <!-- Sin breadcrumb -->
    <Config :contained="false" :background="false" :breadcrumb="false" />
        <nuxt-img src="/imagenes/sello.png" fit="cover" height="100%" />
    </div>
</template>

<script>
export default {
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
    }
}
</script>