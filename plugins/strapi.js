const qs = require('qs');


export default ({
  $config,
  $axios,
  store,
}, inject) => {


  class strapiv4 {
    constructor() {
      $axios.defaults.baseURL = `${$config.strapiUrl}`

      const strapi = this
      $axios.onError((err) => {
        const {
          response
        } = err
        // console.error('AXIOS.ONERROR', response)
        // console.error(JSON.stringify(response))
        if (!err) return
        strapi.lastError = !response ? {
            status: 502,
            message: 'Error desconocido'
          } :
          response.data && response.data.error ? response.data.error :
          response.status && response.message ? {
            status: response.status,
            message: response.message
          } :
          response ? response :
          err
      })

      this.token = ''
      this.url = `${$config.strapiUrl}`
      this._user = null
      this.lastError = {}
    }


    clear() {
      this.lastError = {}
    }

    async find(collection, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.warn('QUERY', `/${collection}${query}`, params)
      this.clear()
      return $axios.get(`/${collection}${query}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })
    }


    // parece que params no hace nada
    async findOne(collection, id, params) {
      const query = !params ? null : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('QUERY', `/${collection}/${id}${query}`)
      this.clear()
      return $axios.get(`/${collection}/${id}${query}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })
    }


    async count(collection, paramsFilter) {
      const params = {
        fields: ['id'],
        populate: [],
        pagination: {
          pageSize: 1
        },
        ...paramsFilter
      }
      const query = !params ? null : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('COUNT QUERY', `/${collection}${query}`)
      this.clear()
      return $axios.get(`/${collection}${query}`)
        .then(r => r.data.meta.pagination.total)
        .catch(err => {
          return 0
        })
    }


    async update(collection, id, data) {
      console.log('STRAPI.PUT', id, {
        data
      })
      this.clear()
      return $axios.put(`/${collection}/${id}`, data)
        .then(r => {
          console.log('RESULT', r)
          return r.data
        })
        .catch(err => {
          return {
            data: []
          }
        })
    }


    async create(collection, data) {
      this.clear()
      return $axios.post(`/${collection}`, {
          data
        })
        .then(r => {
          console.log('RESULT', r)
          return r.data
        })
        .catch(err => {
          return {
            data: []
          }
        })
    }

    async delete(collection, id) {
      this.clear()
      return $axios.delete(`/${collection}/${id}`)
        .then(r => {
          console.log('RESULT DELETE', r)
          return r
        })
        .catch(err => {
          return null
        })
    }

    async login(params) {
      console.log('QUERY', `/auth/local}`, params)
      this.clear()
      return $axios.post(`/auth/local`, params)
        .then(r => {
          console.log('LOGGED', r.data)
          this.setToken(r.data.jwt)
          return true
        })
        .catch(err => {
          return false
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
      this.clear()
      $axios.get(`/users/me`)
        .then(r => {
          console.warn('USER FETCHED', r.data)
          this.user = r.data
          /*this.find('users', {
              filters: {
                  id: {
                      $eq: this.user.id
                  }
              },
              populate: {
                imagen: {
                  fields: ['url', 'width', 'height']
                }
              }
            })
            .then(r2 => {
              console.warn('USER FETCHED 2', r2.data)
              this.user = r2.data[0]
            })*/
          return r.data
        })
        .catch(err => {
          return null
        })
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


    filterByIdSlug(id, params) {
      const {
        filters,
        populate
      } = params || {}
      return {
        ...params,
        filters: id.match(/^\d+$/) ? {
          id: {
            ...filters,
            $eq: id
          }
        } : {
          ...filters,
          slug: {
            $eq: id
          }
        },
        populate: populate == '*' ? '*' : {
          ...populate,
          imagen: {
            fields: ['url', 'width', 'height']
          }
        }
      }
    }

    filterByList(params) {
      const {
        sort,
        populate
      } = params || {}
      return {
        ...params,
        populate: populate == '*' ? '*' : {
          ...populate,
          imagen: {
            fields: ['url', 'width', 'height']
          }
        },
        sort: sort ? sort : ['publishedAt:desc']
      }
    }


    getCollectionFromRoute(route) {
      console.log('GETCOLLECTION FROM', route)
      const parts = route.path.split('/')
      return parts[1].replace("usuarios", "users")
    }

    async findThis(route, params) {
      const collection = this.getCollectionFromRoute(route)
      return this.find(collection, this.filterByIdSlug(route.params.id, params))
    }

    async findList(route, params) {
      const collection = this.getCollectionFromRoute(route)
      return this.find(collection, this.filterByList(params))
    }


  }

  const s4 = new strapiv4()

  inject('strapi', s4)
  // inject('user', s4.user)
  // inject('findId', filterByIdSlug)
  // inject('findList', filterByList)

}
