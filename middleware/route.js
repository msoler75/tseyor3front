export default function ({ res, route, store }) {
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server#timing
    // res.timing.start('midd', 'Middleware timing description')
    
    console.log('*route')
    /* store.commit('setContained', true)
    store.commit('setBackground', true)
    store.commit('setBreadcrumb', true)
    store.commit('setFocused', false)
    */
   store.commit('setMenuUsuario', false)
    store.commit('setNextPathBreadcrumb', route.path)
    store.commit('travelling', true)
    
    // res.timing.end('midd')
}