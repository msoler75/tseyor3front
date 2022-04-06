export default function ({redirect, query, route, store}) {
  if(!query.hash&&!query.correo&&!store.getters.isAuthenticated)
    return redirect('/ingresar?desde='+route.path)
  }