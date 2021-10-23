export default {
  // nuxt/auth
  isAuthenticated (state) {
    return !!state.user
  },
  loggedInUser (state) {
    return state.user
  },

  getIconRoute: state => (path) => {
    if(!path) {
      return ''
    }
    const r = state.breadcrumbs[path]
    return r.icon
  },
  getRouteData: state => (path) => {
    if(!path) {
      return {href: path, name: '', icon: ''}
    }
    var r = state.breadcrumbs[path]
    if(!r) {
      const regularPath = path.replace(/\/\d+$/, '/*')
      const parts = regularPath.split('/').filter(x => x.length !== 0 && x!=='*')
      const pp = '/'+parts[parts.length-1]
      if(pp!==path) {
        r = state.breadcrumbs[pp]
        if(!r && parts.length>1) 
        {
          const pp2 = '/'+parts[parts.length-2] + pp
          if(pp2!==path) {
            r = state.breadcrumbs[pp2]
          }
        }
      }
    }
    if (!r) {
      return {href: path, name: '', icon: ''}
    }
    r= JSON.parse(JSON.stringify(r))
    if(!r.parent && path.indexOf('/')>=0)
    {
      const parts = path.split('/').filter(x=>x.length)
      if(parts.length)
      if('/' + parts[0] !== path)
        r.parent = '/' + parts[0]     
    }
    r.href = path
    return r
  },
  buildRoutes: (state, getters) => (items) => {
    const r = []
    for(const item of items) {
      const data = getters.getRouteData(typeof item === 'string' ? item : item.href)
      if(typeof item === 'object')
        for(const i in item)
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
  
  audioPlaying (state) {
    return state.audioPlaying
  },

  pageContained (state) {
    return state.pageInContainer
  },

  pageBackground (state) {
    return state.pageBackground
  },

  pageBreadcrumb (state) {
    return state.pageBreadcrumb
  },

  pageFocused (state) {
    return state.pageFocused
  },

  menuUsuario (state) {
    return state.menuUsuario
  },

  hideMenus (state) {
    return state.hideMenus
  }

}
