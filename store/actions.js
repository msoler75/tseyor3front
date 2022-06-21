export default {
  async nuxtServerInit(store, context) {
    const {
      $strapi
    } = context
    const token = $strapi.getCookie(context.req.headers.cookie, "jwt")
    if (token)
      $strapi.token = token
    //console.warn('COOKIE TOKEN', token)
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
    .catch(err=>{
      return {data:null}
    })
    if(imagenes)
    store.commit(
      "SET_DEFAULT_IMAGES",
      imagenes
    )
    //if ($strapi.user)
    //$strapi.updateBorradoresNum()
  },
  // page transition
  beforeEnter(store, el) {
    // console.log('store.BeforeEnter...', el)
    if (el.id == '__content')
      el = el.firstChild

    const config = {}
    const pageConfigKeywords = [
      'background',
      'breadcrumb',
      'contained',
      'floatnav',
      'focused',
      'footer',
    ]
    for (const key of pageConfigKeywords) {
      if('getAttribute' in el){
        const value = el.getAttribute(key)
        if (value !== null) {
          config[key] = value && value === true || (value.toLowerCase() !== 'no' && value !== '0')
        }
      }
    }

    // console.log('config', config)
    store.commit('setPageConfig', config)
    store.commit('updateBreadcrumb')
    store.commit('setTravelling', false)
  },

  // page transition
  /*beforeRouteLeave(ctx) {
    console.warn('VUEX.ACTION.BEFOREROUTELEAVE', ctx)
  }*/
}
