export default {
  mounted() {
    if (!this.meta) throw new Error('Debe incluir meta')
  },
  computed: {
    paginaActual() {
        return this.meta.pagination.page
    },
    totalPaginas() {
        return this.meta.pagination.pageCount
    },
    hayMas() {
      const p = this.meta.pagination
      if ('page' in p)
        return p.page < p.pageCount
      return p.start + p.limit < p.total
    },
  }
}
