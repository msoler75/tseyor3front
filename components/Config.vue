<template>
    <div class="d-none"/>
</template>

<script>
export default {
    props: {
        contained: {
            type: Boolean,
            required: false,
            default: true
        },
        background: {
            type: Boolean,
            required: false,
            default: true
        },
        breadcrumb: {
            type: Boolean,
            required: false,
            default: true
        },
        focused: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    created() {
        console.log('config created')
    },    
    mounted() {
        console.log('config mounted')
        if(!this.contained)
            this.$store.commit('setContained', false)
        if(!this.background)
            this.$store.commit('setBackground', false)
        if(!this.breadcrumb)
            this.$store.commit('setBreadcrumb', false)
        if(this.focused)
            this.$store.commit('setFocused', true)
    }
}
</script>

