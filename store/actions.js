export default {
    async nuxtServerInit(store, context) {
    store.commit(
      "SET_USERS",
      await context.$strapi.fetchUser()
    );
  }
}