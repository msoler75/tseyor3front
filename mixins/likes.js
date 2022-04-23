/**
 * Para que funcione este mixin, debes declarar estas propiedades en el componente:
 * 
 *    uid
 *    ccollection (opcional)
 * 
 * */

export default {
  computed: {
    likecollection() {
      if (this.ccollection)
        return this.ccollection
      const parts = this.$route.path.split('/')
      return parts[parts.length - 2]
    },
    likecontent() {
      return this.contenido ? this.contenido : this.data ? this.data : {}
    },
    likesList() {
      return this.likecontent.likes && Array.isArray(this.likecontent.likes) ? this.likecontent.likes : []
    },
    likeing() {
      // console.log('likeit?', this.contenido.likes)
      if (!this.$strapi.user) return false
      return this.likesList.find(x => x.usuario && x.usuario.id === this.$strapi.user.id)
    },
    likesCount() {
      return this.likesList.length
    }
  },
  // CARGA LISTADO DE LIKES AL CONTENIDO O DATA
  async mounted() {
    this.refreshLikes()
  },
  methods: {
    async refreshLikes() {
      if (this.contenido || this.data) {
        this.$set(this.contenido ? this.contenido : this.data, 'likes', await this.getLikes())
      }
    },
    // obtiene la lista de likes de este contenido
    async getLikes() {
      const {
        data: likes
      } = await this.$strapi.find("likes", {
        filters: {
          uid: this.uid
        },
        fields: ['id'],
        populate: {
          usuario: {
            fields: ['id', 'username', 'nombreSimbolico'],
            populate: {
              imagen: {
                fields: ['url', 'width', 'height']
              }
            }
          }
        },
        pagination: {
          pageSize: 9999999,
        }
      })
      console.log('LIKESRECEIBED', likes)
      return likes
    },
    async like() {
      if (!this.$strapi.user) return
      this.likecontent.likes.push({
        usuario: this.$strapi.user
      })
      this.$strapi.create('likes', {
        uid: this.uid,
        usuario: this.$strapi.user.id
      })
    },
    async dislike() {
      if (!this.$strapi.user) return

      const idx = this.likecontent.likes.findIndex(x => x.usuario.id === this.$strapi.user.id)
      let like = idx >= 0 ? this.likecontent.likes[idx] : null
      if (like)
        this.likecontent.likes.splice(idx, 1)
      this.$nextTick(async () => {
        if (!like || !like.id) {
          let result = await this.$strapi.find('likes', {
            filters: {
              uid: this.uid,
              usuario: {
                id: {
                  $eq: this.$strapi.user.id
                }
              }
            }
          })
          like = result.data[0]
        }
        if (like)
          this.$strapi.delete('likes', like.id)
      })
    }
  }
}
