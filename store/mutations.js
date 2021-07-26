export default {
  setTitle (state, titulo) {
    console.log('store.setTitle', titulo)
    state.tituloPagina = titulo
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

  setLoggedIn(state, payload) {
    state.loggedIn = payload
    if(payload)
    {
      const i = Math.ceil(Math.random()*92)
      state.user = {
        id: (i*177)%255,
        clase: "usuarios",
        imagen: "usuario" + ((i % 8) + 1) + ".jpg",
        nombre: this.$lorem(1, 1, 3).slice(0, -1)
      }
    }
  }
}
