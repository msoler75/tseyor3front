export default {
  SET_USER(state, user) {
    // console.log('SET_USER', user)
    state.user = user
  },

  SET_DEFAULT_IMAGES(state, obj) {
    // console.warn('SET_DEFAULT_IMAGES', obj)
    state.defaultImages = obj
  },

  SET_BORRADORES(state, num) {
    //console.log('SET_BORRADORES', num)
    state.borradoresNum = num
  },

  setPageConfig(state, payload) {
    // console.log('setPageConfig', payload)
    state.pageConfig = {
      breadcrumb: true,
      background: true,
      contained: true,
      focused: false,
      footer: true,
      ...payload
    }


    if (process.browser) {
      const d = document
      const de = d.documentElement

      const pageConfigKeywords = [
        'background',
        'breadcrumb',
        'contained',
        'focused',
        'footer',
      ]
      for (const key of pageConfigKeywords) {
        if (d && de && state.pageConfig[key])
          de.classList.add('page-' + key)
        else
          de.classList.remove('page-' + key)
      }

    }

    // cuando cambiamos de página, además mostramos el menu top navigation
    state.navHidden = false
    //console.log(state.pageConfig)
  },

  setDropHandler(state, func) {
    //console.log('setDropHandler', func, state)
    state.dropHandler = func
  },

  setDropAccept(state, accept) {
    //console.log('setDropAccept', accept, state)
    state.dropAccept = accept || '*/*'
  },

  setBreadcrumbHandler(state, handler) {
    console.log('setBreadcrumbHandler', handler)
    state.breadcrumbHandler = handler
  },

  setNextPathBreadcrumb(state, payload) {
    // console.log('setNextPathBreadcrumb', payload)
    state.nextPathBreadcrumb = payload
  },

  updateBreadcrumb(state, payload) {
    // console.log('store.updateBreadcrumb()')
    state.pathBreadcrumb = payload ? payload : state.nextPathBreadcrumb
    state.nextPathBreadcrumb = state.pathBreadcrumb
  },

  setCarpeta(state, payload) {
    state.carpeta = payload
  },

  setLoading(state, payload) {
  // console.log('loading=', payload)
    state.loading = payload
  },

  setVistaArchivos(state, payload)  {
    state.vistaArchivos = payload
  },

  setTravelling(state, payload) {
    // console.log('travelling=', payload)
    state.travelling = payload
  },

  setNavHidden(state, payload) {
    state.navHidden = payload
  },

  setMenuUsuario(state, payload) {
    // console.log('setMenuUsuario', payload)
    state.menuUsuario = payload
  },

  setOnlyContent(state, payload) {
    state.onlyContent = payload
  },

  setBackgroundImageUrl(state, url) {
    state.backgroundImageUrl = url
  },
  /**
   * Reproduce el audio
   * @param {*} payload que contiene { title, artist, src, pic }
   */
  setAudioPlay(state, payload) {
    state.audioPlaying = {
      ...state.audioPlaying,
      title: payload.title,
      artist: payload.artist,
      src: payload.src,
      pic: payload.pic
    }
  }
}
