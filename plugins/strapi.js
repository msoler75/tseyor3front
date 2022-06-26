export default class strapiv4 {

  constructor() {
    
    this.url = `${$config.strapiUrl}`
    this._user = null
    this._token = ''
    if (process.client) {
      const jwt = this.getCookie(document.cookie, 'jwt')
      if (jwt) {
        this.token = jwt
        this.fetchUser()
      }
    }
  }

  /** main request function to strapi
   * fn is optional function callback to process response
   */
  async request(method, route, data, params, fn) {
    const query = !params ? '' : typeof params === 'string' ? params : '?' + qs.stringify(params, {
      encodeValuesOnly: true,
    })
    const headers = !data ? {} : data instanceof FormData ? {} : {
      "Content-Type": "application/json"
    }
    const body = !data ? null : data instanceof FormData ? data : JSON.stringify({
      data
    })
    return fetch(`${this.url}${route}${query}`, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.token}`
        },
        body
      })
      .then(response => response.json())
      .then(response => fn ? fn(response) : this.transform(response))
  }

  /** primitive method GET */
  async $get(route, params) {
    return this.request('GET', route, params)
  }

  /** primitive method POST */
  async $post(route, data, params) {
    return this.request('POST', route, data, params)
  }

  /** primitive method PUT */
  async $put(route, data, params) {
    return this.request('PUT', route, data, params)
  }

  /** primitive method DELETE */
  async $delete(route) {
    return this.request('DELETE', route)
  }

  // find, findOne, create, delete, upload methods

  /** Core find method */
  async find(collection, params) {
    return this.$get(`/${collection}`, params)
  }

  /** Core findOne method */
  async findOne(collection, id, params) {
    return this.$get(`/${collection}/${id}`, params)
  }

  /** Core create method */
  async create(collection, data, params) {
    return this.$post(`/${collection}`, data, params)
  }

  /** Core update method */
  async update(collection, id, data, params) {
    return this.$put(`/${collection}/${id}`, data, params)
  }

  /** Core delete method */
  async delete(collection, id) {
    return this.$delete(`/${collection}/${id}`)
  }

  /** Helper method to count results */
  async count(collection, paramsFilter) {
    const params = {
      fields: ['id'],
      populate: [],
      pagination: {
        pageSize: 1
      },
      ...paramsFilter
    }
    return this.request('GET', `/${collection}`, null, params, (r) => r.meta ? r.meta.pagination.total : Array.isArray(r) ? r.length : r)
  }


  /** upload files to upload plugin (with formData) 
   * progress is an optional callback function */
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


  /** login to Strapi */
  async login(data) {
    return this.request('POST', '/auth/local', data, null, (response) => {
      if (!response.error) {
        this.user = response.user
        this.token = response.jwt
        this.setCookie('jwt', this.token)
      }
      this.fetchUser()
      return response
    })
  }

  /** Logout from strapi */
  async logout() {
    this.token = null
    this.user = null
    this.removeCookie('jwt')
  }

  /** Get user data */
  async fetchUser() {
    // console.log('STRAPI.FETCHUSER')
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

  /** retrieve user from vuex store */
  get user() {
    return store.getters.user
  }

  /** save user to vuex store */
  set user(obj) {
    store.commit(
      "SET_USER",
      obj
    )
  }

  /** get jwt token */
  get token() {
    return this._token
  }

  /** set jwt token */
  set token(token) {
    this._token = token
    // console.log('SET TOKEN', token)
  }

  /** Transform response removing 'attributes' and 'data' related fields */
  transform(data) {
    if (Array.isArray(data)) {
      for (const key in data)
        data[key] = this.transform(data[key])
      return data
    }
    if (data && typeof data == 'object' && 'data' in data && 'error' in data && data.error) {
      return data
    }
    if (data && typeof data == 'object' && 'data' in data && 'meta' in data) {
      data.data = this.transform(data.data)
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
    return data
  }


  /** save cookie */
  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  /** remove cookie */
  removeCookie(cname) {
    let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = cname + "=;" + expires + ";path=/";
  }

  /** get cookie */
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

}
