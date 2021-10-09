/**
 * Para que funcione este mixin, debes declarar 3 métodos en el componente:
 * 
 *    likedItem (id) 
 *    dislikedItem (id)
 *    saveRefreshedItem(id, item)
 * 
 *    y propiedades:
 * 
 *    uid
 *    ccollection (opcional)
 * 
 * */


export default {
  methods: {
    async refreshItem (id) {
        const likes = await this.$strapi.find('likes', { uid: this.uid })
        this.saveRefreshedItem(id, likes)
    },
    async like (id) {
      if(!this.$strapi.user) return
      // console.log('like', id)
      this.likedItem(id)
      //this.$strapi.$http.setToken(this.$auth.getToken('local'))
      //this.$strapi.
      // await this.$strapi.$http.$put(`/${this.collection}/${id}/like`)
      
      await this.$axios
      .$post("/api/likes", {
        uid: this.uid
      })

      this.refreshItem(id)
    },
    async dislike (id) {
      if(!this.$strapi.user) return
      // console.log('dislike', id)
      this.dislikedItem(id)
      //this.$strapi.$http.setToken(this.$auth.getToken('local'))
      // await this.$strapi.$http.$put(`/${this.collection}/${id}/dislike`)
      const results = await this.$strapi.find('likes', {uid: this.uid, user: this.$strapi.user.id})
      if(results.length) {
        await this.$axios.$delete(`/api/likes/${results[0].id}`)
        this.refreshItem(id)
      }
    }
  },
  computed: {
    collection () {
      if (this.ccollection) 
        return this.ccollection
      const parts = this.$route.path.split('/')
      return parts[parts.length-2]
    }
  }
}
