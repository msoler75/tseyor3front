/**
 * Para que funcione este mixin, debes declarar estas propiedades en el componente:
 * 
 *    uid
 * 
 * */

export default {
  computed: {
    likecontent() {
      return this.contenido ? this.contenido : this.data ? this.data : {}
    },
    likesList() {
      return this.likecontent.likes && Array.isArray(this.likecontent.likes) ? this.likecontent.likes : []
    },
    likeing() {
      if (!this.$strapi.user) return false
      return !!this.likesList.find(x => x.usuario && x.usuario.id === this.$strapi.user.id)
    },
    likesCount() {
      return this.likesList.length
    },
    cuid() {
      return this.uid
    }
  },
  // CARGA LISTADO DE LIKES AL CONTENIDO O DATA
  async mounted() {
    this.refreshLikes()
  },
  watch: {
    cuid(newValue) {
      this.$nextTick(()=>this.refreshLikes)
    }
  },
  methods: {
    async refreshLikes() {
      if(this.cuid&&this.likecontent&&!this.likecontent.likes)
        this.$set(this.likecontent, 'likes', await this.getLikes())
    },
    // obtiene la lista de likes de este contenido
    async getLikes() {
      const {
        data: likes
      } = await this.$strapi.find("likes", {
        filters: {
          uid: this.cuid
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
        uid: this.uid,
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
