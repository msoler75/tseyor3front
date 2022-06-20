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
      console.log('NEW STRAPI4!!', this)
      // this.lastError = {}
      if (process.client) {
        const jwt = this.getCookie(document.cookie, 'jwt')
        if (jwt) {
          this.token = jwt
          this.fetchUser()
        }
      }
    }


    /* transformField(response) { 

    }, */

    transform(data) {
      //console.log('transform', data)
      if (Array.isArray(data)) {
        for (const key in data)
          data[key] = this.transform(data[key])
        return data
      }
      if (data && typeof data == 'object' && 'data' in data && 'meta' in data) {
        //for (const key in data)
          //data[key] = key == 'data' ? this.transform(data[key]) : data[key]
        data.data = this.transform(data.data)
        //console.log('to', data)
        return data
      }
      if (data && typeof data == 'object' && 'attributes' in data) {
        for (const key in data.attributes)
          data[key] = this.transform(data.attributes[key])
        delete data.attributes
      }
      if (data && typeof data == 'object' && 'data' in data) { 
        return this.transform(data.data)
      }
      //console.log('to', data)
      return data
    }

    setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    removeCookie(cname) {
      let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = cname + "=;" + expires + ";path=/";
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

    // clearCookie()

    async find(collection, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('QUERY', `/${collection}${query}`, params, 'token=', this.token)
      /*return $axios.get(`/${collection}${query}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })*/
      return fetch(`${this.url}/${collection}${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(x => {
          console.log('FIND RESULT', x)
          return this.transform(x)
        })
    }

    // parece que params no hace nada
    async findOne(collection, id) {
      console.log('QUERY', `/${collection}/${id}`, 'token=', this.token)
      /*return $axios.get(`/${collection}/${id}`)
        .then(r => r.data)
        .catch(err => {
          return {
            data: []
          }
        })*/

      return fetch(`${this.url}/${collection}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(res => !res.error ? this.transform(res.data) : res)
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

      return fetch(`${this.url}/${collection}${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(r => r.meta ? r.meta.pagination.total : Array.isArray(r) ? r.length : r)
    }


    async update(collection, id, data, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('QUERY', `/${collection}${query}/${id}${query}`, params, 'token=', this.token)
      console.log('STRAPI.PUT', id, {
        data
      }, 'token=', this.token)
      return fetch(`${this.url}/${collection}/${id}${query}`, {
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


    async create(collection, data, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      console.log('QUERY', `/${collection}${query}`, params, 'token=', this.token)
      console.log('STRAPI.CREATE', collection, data)
      const headers = data instanceof FormData ? {} : {
        "Content-Type": "application/json"
      }
      return fetch(`${this.url}/${collection}${query}`, {
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


    async upload(data, progress) {
      if (!(data instanceof FormData)) {
        console.error('Para el upload se requiere un FormData')
        throw new Error('Para el upload se requiere un FormData')
      }
      if (progress) {
        return new Promise((success, reject) => {
          let request = new XMLHttpRequest();
          request.open('POST', `${this.url}/upload`)
          request.setRequestHeader('Authorization', `Bearer ${this.token}`)
          // upload progress event
          request.upload.addEventListener('progress', progress)
          // request finished event
          request.addEventListener('load', function (e) {
            success(JSON.parse(request.response))
          });
          request.addEventListener('error', event => {
            reject(event)
          })
          // send POST request to server
          request.send(data);
        })
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

      return fetch(`${this.url}/${collection}/${id}`, {
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
      /*return $axios.post(`/auth/local`, data)
        .then(r => {
          console.log('LOGGED', r.data)
          this.token = r.data.jwt
          return true
        })
        .catch(err => {
          return false
        })
        */
      return fetch(`${this.url}/auth/local`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
          console.log('LOGIN RES', res)
          if (!res.error) {
            this.user = res.user
            this.token = res.jwt
            this.setCookie('jwt', this.token)
          }
          this.fetchUser()
          return res
        })
    }

    async logout() {
      this.token = null
      this.user = null
      this.removeCookie('jwt')
      // if(process.client) {}
    }



    async fetchUser() {
      console.log('STRAPI.FETCHUSER')
      /* return $axios.get(`/users/me`)
        .then(r => {
          console.log('USER FETCHED', r.data)
          this.user = r.data
          return r.data
        }) */
      return this.find('users/me').then(user => {
          // console.warn('RET USER', user)
          if (!user.error) {
            this.user = user
            return user
          }
          return null
        })
        .catch(err => {
          console.warn(err)
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

    get token() {
      return this._token
    }

    set token(token) {
      this._token = token
      console.log('SET TOKEN', token)
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
      console.log('parts', parts)
      return parts[1].replace("usuarios", "users")
    }

    async getContent(route, params) {
      const collection = this.getCollectionFromRoute(route)
      const response = await this.find(collection, this.filterByIdSlug(route.params.id, params))
      console.log('GETCONTENT RESPONSE', response)
      let data = response.data ? response.data : response
      return Array.isArray(data) ? data[0] : data
    }

    async findList(route, params) {
      const collection = this.getCollectionFromRoute(route)
      return this.find(collection, this.filterByList(params))
    }

    async put(route, data, params) {
      const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
        encodeValuesOnly: true,
      })
      return fetch(`${this.url}${route}${query}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          },
          body: data
        })
        .then(res => res.json())
    }

  }

  const strapi4 = new strapiv4()

  if (!$strapi)
    inject('strapi', strapi4)
  // inject('user', s4.user)
  // inject('findId', filterByIdSlug)
  // inject('findList', filterByList)

}
