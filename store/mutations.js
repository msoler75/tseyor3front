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
    console.log(state.pageConfig)
  },

  travelling(state, payload) {
    state.travelling = payload
  },

  setMenuUsuario(state, payload) {
    state.menuUsuario = payload
  },

  setHideMenus(state, payload) {
    state.hideMenus = payload
  },
  /**
   * Reproduce el audio
   * @param {*} payload que contiene { title, artist, src, pic }
   */
  setAudioPlay(state, payload) {
    state.audioPlaying = { ...state.audioPlaying, title: payload.title, artist: payload.artist, src: payload.src, pic: payload.pic }
  }
}
