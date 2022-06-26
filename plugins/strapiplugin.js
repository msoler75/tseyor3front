const strapiv4 = require('./strapi.js');


export default ({
  $strapi,
  $config,
  store,
}, inject) => {


  class strapiv4extended extends strapiv4{

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


  }

  const strapi4ext = new strapiv4extended()

  if (!$strapi)
    inject('strapi', strapiv4ext)

}
