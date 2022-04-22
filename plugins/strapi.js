const qs = require('qs');


export default ({
  $config,
  $axios,
  store
}, inject) => {


  class strapiv4 {
    constructor() {
      $axios.defaults.baseURL = `${$config.strapiUrl}`
      this.token = ''
      this.url = `${$config.strapiUrl}`
      this._user = null
    }

    async find(collection, params) {
      const query = !params ? null : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('QUERY', `/${collection}${query}`)
      return $axios.get(`/${collection}${query}`)
        .then(r => r.data)
        .catch(err => {
          console.error(err)
          return {
            data: []
          }
        })
    }

    async create(collection, data) {
      return $axios.post(`/${collection}`, {
          data
        })
        .then(r => {
          console.log('RESULT', r)
          return r.data
        })
        .catch(err => {
          console.error(err)
          return {
            data: []
          }
        })
    }

    async login(params) {
      console.log('QUERY', `/auth/local}`, params)
      return $axios.post(`/auth/local`, params)
        .then(r => {
          console.log('LOGGED', r.data)
          this.setToken(r.data.jwt)
          return true
        })
    }

    async logout() {
      this.setToken(null)
      // this.token = null
      // this.config = null
    }

    async setToken(token) {
      this.token = token
      $axios.defaults.headers.common = token && token != 'null' ? {
        Authorization: `Bearer ${token}`
      } : {
        Authorization: null
      }
    }
    async fetchUser() {
      return $axios.get(`/users/me`)
        .then(r => {
          console.warn('USER FETCHED', r.data)
          this.user = r.data
          return r.data
        })
        .catch(err => null)
    }

    get user() {
      return store.getters.user
    }

    set user(obj) {
      store.commit(
        "SET_USER",
        obj
      )
    }

  }

  const s4 = new strapiv4()

  inject('strapi', s4)
  // inject('user', s4.user)
}
