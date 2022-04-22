export default function ({redirect, query, route, store}) {
  if(!query.hash&&!query.correo&&!store.getters.$strapi.user)
    return redirect('/ingresar?desde='+route.path)
  }