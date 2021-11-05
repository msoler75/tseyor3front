export default {
    async nuxtServerInit(store, context) {
    store.commit(
      "SET_USER",
      await context.app.$fetchUser()
    );
  },
  // page transition
  beforeEnter (store, el) {
    console.log('Before enter...', el)
    const config = {}
    const pageConfigKeywords = [
      'background',
      'breadcrumb',
      'contained',
      'focused'
    ]
    for (const key of pageConfigKeywords) {
      const value = el.getAttribute(key)
      if (value !== null)
        config[key] = value && value.toLowerCase() !== 'no' && value !== '0'
    }
    console.log('config', config)
    store.commit('setPageConfig', config)
    store.commit('updateBreadcrumb')
    store.commit('travelling', false)
  }
}