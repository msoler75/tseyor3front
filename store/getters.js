import state from "./state"

export default {
  // nuxt/auth
  user(state) {
    return state.user
  },

  getImageFor: state => (collection) => {
    console.warn('getImageFor', collection)
    if(!(collection in state.defaultImages) || !state.defaultImages[collection]) 
      return state.defaultImages.generica
    return state.defaultImages[collection]
  },

  getPathBreadcrumb(state) {
    return state.pathBreadcrumb
  },

  getIconRoute: state => (path) => {
    if (!path) {
      return ''
    }
    const r = state.breadcrumbs[path]
    return r.icon
  },
  getRouteData: state => (path) => {
    if (!path) {
      return {
        href: path,
        name: '',
        icon: ''
      }
    }
    var r = state.breadcrumbs[path]
    if (!r) {
      const regularPath = path.replace(/\/\d+$/, '/*')
      const parts = regularPath.split('/').filter(x => x.length !== 0 && x !== '*')
      const pp = '/' + parts[parts.length - 1]
      if (pp !== path) {
        r = state.breadcrumbs[pp]
        if (!r && parts.length > 1) {
          const pp2 = '/' + parts[parts.length - 2] + pp
          if (pp2 !== path) {
            r = state.breadcrumbs[pp2]
          }
        }
      }
    }
    if (!r) {
      return {
        href: path,
        name: '',
        icon: ''
      }
    }
    r = JSON.parse(JSON.stringify(r))
    if (!r.parent && path.indexOf('/') >= 0) {
      const parts = path.split('/').filter(x => x.length)
      if (parts.length)
        if ('/' + parts[0] !== path)
          r.parent = '/' + parts[0]
    }
    r.href = path
    return r
  },
  buildRoutes: (state, getters) => (items) => {
    const r = []
    for (const item of items) {
      const data = getters.getRouteData(typeof item === 'string' ? item : item.href)
      if (typeof item === 'object')
        for (const i in item)
          data[i] = item[i]
      r.push(data)
    }
    return r
  },
  /* title (state) {
    return state.SEO.title
  },
  description (state) {
    return state.SEO.description
  },
  imagen (state) {
    return state.SEO.image
  },
  type (state) {
    return state.SEO.type
  }, */

  audioPlaying(state) {
    return state.audioPlaying
  },

  pageConfig(state) {
    return state.pageConfig
  },

  travelling(state) {
    return state.travelling
  },

  navHidden(state) {
    return state.navHidden
  },

  menuUsuario(state) {
    return state.menuUsuario
  },

  onlyContent(state) {
    return state.onlyContent
  },

  backgroundImageUrl(state) {
    return state.backgroundImageUrl
  }

}
