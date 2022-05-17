export default ({
  store,
  $strapi
}, inject) => {


  const updateBorradoresNum = async () => {
    let borradores = 0
    if ($strapi.user)
      borradores = await $strapi.count('contenidos', $strapi.filterByList({
        filters: {
          autorref: {
            $eq: $strapi.user.id
          },
          publishedAt: {
            $null: true
          },
        },
        publicationState: 'preview',
        sort: ['updatedAt:desc']
      }))
    store.commit('SET_BORRADORES', borradores)
  }

  const borradoresEquipo = async (idEquipo) => {
    let borradores = 0
    if ($strapi.user)
      borradores = await $strapi.count('contenidos', $strapi.filterByList({
        filters: {
          coleccion: {
            $eq: 'publicaciones'
          },
          extra: {
            $eq: idEquipo
          },
          publishedAt: {
            $null: true
          },
          tipo: {
            $notIn: ['Anuncio', 'Información']
          }
        },
        publicationState: 'preview',
        sort: ['updatedAt:desc']
      }))
    return borradores
  }

  inject('updateBorradoresNum', updateBorradoresNum)
  inject('borradoresEquipo', borradoresEquipo)
}
