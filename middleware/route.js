export default function ({ res, store }) {
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server#timing
    res.timing.start('midd', 'Middleware timing description')
    
    
    store.commit('setContained', true)
    
    
    res.timing.end('midd')
}