export default {
  setSEO (state, seo) {
    console.log('store.seo', seo)
    state.SEO.title = seo.title
    state.SEO.description = seo.description
    state.SEO.image = seo.image
    state.SEO.type = seo.type
  },
  setTitle (state, title) {
    // state.SEO.title = title
  },
  /**
   * Reproduce el audio
   * @param {*} payload que contiene { title, artist, src, pic }
   */
  setAudioPlay(state, payload) {
    state.audioPlaying = { ...state.audioPlaying, title: payload.title, artist: payload.artist, src: payload.src, pic: payload.pic }
  },

  setContained(state, payload) {
    state.pageInContainer = payload
  },

  setBackground(state, payload) {
    state.pageBackground = payload
  },

  setBreadcrumb(state, payload) {
    state.pageBreadcrumb = payload
  },

  setMenuUsuario(state, payload) {
    state.menuUsuario = payload
  },

  setHideMenus(state, payload) {
    state.hideMenus = payload
  }

}
