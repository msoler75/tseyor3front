export default function ({redirect, route, store}) {
    if (!store.getters.isAuthenticated) {
      return redirect('/login?desde='+route.path)
    }
  }