export default {
    async nuxtServerInit(store, context) {
    store.commit(
      "SET_USER",
      await context.$strapi.fetchUser()
    );
  }
}