export default function ({redirect, store}) {
    if (store.getters.isAuthenticated) {
      return redirect('/')
    }
  }