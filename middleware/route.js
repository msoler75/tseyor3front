export default function ({ res, route, store }) {
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server#timing
    // res.timing.start('midd', 'Middleware timing description')
    console.warn('ROUTE', route)

   store.commit('setMenuUsuario', false)
    store.commit('setNextPathBreadcrumb', route.path)
    store.commit('setBackgroundImageUrl', null)
   //store.commit('travelling', true)
    
    // reseteamos dropHandler
    store.commit('setDropHandler', null)
    store.commit('setDropAccept', null)
    // res.timing.end('midd')
    store.commit('setBreadcrumbHandler', null)
}