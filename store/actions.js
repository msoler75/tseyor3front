

export default {
  async nuxtServerInit(store, context) {
    const {
      $strapi
    } = context
    const token = $strapi.getCookie(context.req.headers.cookie, "jwt")
    if (token)
      $strapi.token = token
    console.warn('COOKIE TOKEN', token)
    // carga las imágenes por defecto
    store.commit(
      "SET_USER",
      await $strapi.fetchUser()
    )
    // carga las imágenes
    const {
      data: imagenes
    } = await $strapi.find('imagenes-por-tipo', {
      populate: '*'
    })
    store.commit(
      "SET_DEFAULT_IMAGES",
      imagenes
    )
  },
  // page transition
  beforeEnter(store, el) {
    // console.log('store.BeforeEnter...', el)
    const config = {}
    const pageConfigKeywords = [
      'background',
      'breadcrumb',
      'contained',
      'focused',
      'footer'
    ]
    for (const key of pageConfigKeywords) {
      const value = el.getAttribute(key)
      if (value !== null) {
        config[key] = value && value === true || (value.toLowerCase() !== 'no' && value !== '0')
      }
    }
    // console.log('config', config)
    store.commit('setPageConfig', config)
    store.commit('updateBreadcrumb')
    store.commit('travelling', false)
  }
}
