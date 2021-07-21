<<<<<<< HEAD
export default function ({ res, store }) {
=======
export default function ({ route, store }) {
>>>>>>> 5b926bc2a1de7e3a306baf12ce3b4a592763b686
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server#timing
    res.timing.start('midd', 'Middleware timing description')
    
    
    store.commit('setContained', true)
    
    
    res.timing.end('midd')
}