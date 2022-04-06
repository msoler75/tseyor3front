import state from "./state"

export default {
  SET_USER(state, user) {
    console.log('SET_USER', user)
    state.user = user
  },

  setPageConfig(state, payload) {
    console.log('setPageConfig', payload)
    state.pageConfig = 
    { 
      contained : true,
      background : true,
      breadcrumb: true,
      focused: false,
      ...payload
    }


    if (process.browser) {
      const d = document
      const de = d.documentElement

      const pageConfigKeywords = [
        'background',
        'breadcrumb',
        'contained',
        'focused'
      ]
      for (const key of pageConfigKeywords) {
      if(d && de && state.pageConfig[key])
        de.classList.add('page-'+key)
      else
        de.classList.remove('page-'+key)
      }

    }
    
    // cuando cambiamos de página, además mostramos el menu top navigation
    state.navHidden = false
    console.log(state.pageConfig)
  },

  setNextPathBreadcrumb(state, payload){
    console.log('setNextPathBreadcrumb', payload )
    state.nextPathBreadcrumb = payload
  }, 

  updateBreadcrumb(state, payload) {
    console.log('store.updateBreadcrumb()')
    state.pathBreadcrumb = payload?payload:state.nextPathBreadcrumb
    state.nextPathBreadcrumb = state.pathBreadcrumb
  },

  travelling(state, payload) {
    console.log('travelling=', payload)
    state.travelling = payload
  },

  setNavHidden(state, payload) {
    state.navHidden = payload
  },

  setMenuUsuario(state, payload) {
    console.log('setMenuUsuario', payload)
    state.menuUsuario = payload
  },

  setOnlyContent(state, payload) {
    state.onlyContent = payload
  },
  /**
   * Reproduce el audio
   * @param {*} payload que contiene { title, artist, src, pic }
   */
  setAudioPlay(state, payload) {
    state.audioPlaying = { ...state.audioPlaying, title: payload.title, artist: payload.artist, src: payload.src, pic: payload.pic }
  }
}
