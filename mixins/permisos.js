import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    // comprueba si el usuario tiene acceso segun los permisos indicados
    tengoPermiso (contenido, modo) {
      if (this.soyAutor(contenido)) return true
      if (!('permisos' in contenido)) return false
      const permisos = contenido.permisos
      // console.log('tengo acceso?', permisos)
      if (!permisos) return true
      const p = permisos[modo]
      if (!p) return false
      // console.log('permisos son', p)
      if (p.rol === 'Publico') return true
      const user = this.isAuthenticated ? this.loggedInUser : null
      console.log('user', user)
      if (user && user.id) {
        // console.log('miramos permisos de usuario', user)
        if (p.rol === 'Autenticados') {
          return true
        }
        if (p.rol === 'Delegados' && user.role.type === 'delegado') {
          return true
        }
        if (p.rol === 'Muul' && user.role.type === 'muul') {
          return true
        }
        if (p.usuarios.find(x => x.id === user.id)) {
          return true
        }
        for (const g of p.grupos) {
          if (user.grupos.find(x => x.id === g.id)) {
            return true
          }
        }
        for (const e of p.equipos) {
          if (user.equipos.find(x => x.id === e.id)) {
            return true
          }
        }
      }
      return false
    },
    soyAutor (contenido) {
      const user = this.isAuthenticated ? this.loggedInUser : null
      if (!user || !user.id || !('autor' in contenido) || !contenido.autor)
        return false
      const aid = contenido.autor.id ? contenido.autor.id : contenido.autor
      return aid === user.id || parseInt(aid) === user.id
    }
  }
}
