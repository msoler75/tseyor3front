export default function ({redirect, route, store}) {
    if (!store.getters.isAuthenticated) {
      return redirect('/ingresar?desde='+route.path)
    }
  }