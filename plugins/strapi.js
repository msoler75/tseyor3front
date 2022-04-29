const qs = require('qs');


export default ({
  $strapi,
  $config,
  // $axios,
  store,
}, inject) => {


  class strapiv4 {
    constructor() {
      // $axios.defaults.baseURL = `${$config.strapiUrl}`

      /* const strapi = this
      $axios.onError((err) => {
        const {
          response
        } = err
        console.error('AXIOS.ONERROR', response)
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
      }) */

      this.url = `${$config.strapiUrl}`
      this._user = null
      this._token = ''
      console.warn('NEW STRAPI4!!', this)
      // this.lastError = {}
      if (process.client) {
        const jwt = this.getCookie(document.cookie, 'jwt')
        if (jwt) {
          this.token = jwt
          this.fetchUser().then(user => {
            store.commit(
              "SET_USER",
              user
            )
          })
        }
      }
    }


    getCookie(cookieString, cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(cookieString);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    async find(collection, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.warn('QUERY', `/${collection}${query}`, params, 'token=', this.token)
      /*return $axios.get(`/${collection}${query}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })*/
      return fetch(`${$config.strapiUrl}/${collection}${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
    }

    // parece que params no hace nada
    async findOne(collection, id) {
      console.log('QUERY', `/${collection}/${id}`)
      /*return $axios.get(`/${collection}/${id}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })*/

      return fetch(`${$config.strapiUrl}/${collection}${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
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
      /* return $axios.get(`/${collection}${query}`)
        .then(r => r.data.meta.pagination.total)
        .catch(err => {
          return 0
        }) */

      return fetch(`${$config.strapiUrl}/${collection}${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
    }


    async update(collection, id, data, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.warn('QUERY', `/${collection}${query}/${id}${query}`, params, 'token=', this.token)
      console.warn('STRAPI.PUT', id, {
        data
      }, 'token=', this.token)
      return fetch(`${$config.strapiUrl}/${collection}/${id}${query}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data
          })
        })
        .then(res => res.json())
      /*return $axios.put(`/${collection}/${id}`, {
        data
      })*/
    }


    async create(collection, data) {
      console.log('STRAPI.CREATE', collection, data)
      const headers = data instanceof FormData ? {} : {
        "Content-Type": "application/json"
      }
      return fetch(`${$config.strapiUrl}/${collection}`, {
          method: "POST",
          headers: {
            ...headers,
            Authorization: `Bearer ${this.token}`
          },
          body: data instanceof FormData ? data : JSON.stringify({
            data
          })
        })
        .then(response => response.json())
    }


    async upload(data) {
      if (!(data instanceof FormData)) {
        console.error('Para el upload se requiere un FormData')
        throw new Error('Para el upload se requiere un FormData')
      }
      return this.create('upload', data)
    }

    async delete(collection, id) {
      /*return $axios.delete(`/${collection}/${id}`)
        .then(r => {
          console.log('RESULT DELETE', r)
          return r
        })
        .catch(err => {
          return null
        })*/

      return fetch(`${$config.strapiUrl}/${collection}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(response => response.json())
    }

    async login(data) {
      console.log('QUERY', `/auth/local}`, data)
      /*return $axios.post(`/auth/local`, params)
        .then(r => {
          console.log('LOGGED', r.data)
          this.token = r.data.jwt
          return true
        })
        .catch(err => {
          return false
        })
        */
      return fetch(`${$config.strapiUrl}/auth/local`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data
          })
        })
        .then(response => response.json())
    }

    async logout() {
      this.token = null
      // if(process.client) {}
    }



    async fetchUser() {
      console.warn('STRAPI.FETCHUSER')
      /* return $axios.get(`/users/me`)
        .then(r => {
          console.warn('USER FETCHED', r.data)
          this.user = r.data
          return r.data
        }) */
      return this.find('users/me').then(user => {
        console.log('RET USER', user)
        this.user = user
        return user
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

    get token() {
      return this._token
    }

    set token(token) {
      this._token = token
      console.warn('SET TOKEN', token)
      /*$axios.defaults.headers.common = token && token != 'null' ? {
        Authorization: `Bearer ${token}`
      } : {} */
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
      console.log('GETCOLLECTION FROM', route.path)
      const parts = route.path.split('/')
      return parts[1].replace("usuarios", "users")
    }

    async getContent(route, params) {
      const collection = this.getCollectionFromRoute(route)
      const {
        data: [content]
      } = await this.find(collection, this.filterByIdSlug(route.params.id, params))
      return content
    }

    async findList(route, params) {
      const collection = this.getCollectionFromRoute(route)
      return this.find(collection, this.filterByList(params))
    }


  }

  const strapi4 = new strapiv4()

  if (!$strapi)
    inject('strapi', strapi4)
  // inject('user', s4.user)
  // inject('findId', filterByIdSlug)
  // inject('findList', filterByList)

}
