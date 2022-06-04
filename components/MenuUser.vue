<template>
  <Poppable v-model="localValue">
    <Card
      class="py-3 px-5 w-52 fixed right-0 top-[48px] sm:top-[51px] md:top-[68px] lg:top-[72px] xl:top-[76px] z-40
      rounded-t-none"
    >
      <ul class="list-none">
        <li v-for="item of items" :key="item.href">
          <NLink
            v-if="item.href"
            :to="item.href"
            class="w-full flex items-center py-1"
          >
            <icon
              v-if="item.icon"
              :icon="item.icon"
              class="!w-4 mr-3 text-gray"
            />
            {{ item.name }}
            <span
              v-if="item.badge"
              class="ml-auto bg-error text-white rounded-full px-2"
              >{{ item.badge }}</span
            >
          </NLink>
          <div
            v-else-if="item.click"
            @click="item.click"
            class="cursor-pointer flex items-center py-1"
          >
            <icon
              v-if="item.icon"
              :icon="item.icon"
              class="!w-4 mr-3 text-gray"
            />
            {{ item.name }}
          </div>
        </li>
      </ul>
    </Card>
  </Poppable>
</template>

<script>
import { mapGetters } from "vuex";
import vmodel from "~/mixins/vmodel.js";
export default {
  mixins: [vmodel],
  computed: {
    ...mapGetters(["user", "borradoresNum"]),
    items() {
      const items = [
        {
          icon: "fas fa-user",
          name: "Mi Perfil",
          href: this.user ? `/usuarios/${this.user.id}` : null,
        },
        {
          icon: "fas fa-envelope",
          name: "Suscripciones",
          href: "/suscripciones",
        },
        {
          icon: "fas fa-sign-out-alt",
          name: "Cerrar Sesión",
          click: () => {
            this.logout();
          },
        },
      ];
      if (this.borradoresNum)
        items.unshift({
          icon: "fas fa-pen-alt",
          name: "Borradores",
          href: "/borradores",
          badge: this.borradoresNum,
        });
      return items;
    },
  },
  watch: {
    user(newValue) {
      // this.actualizarUrlPerfil()
    },
  },
  methods: {
    async logout() {
      // await this.$auth.logout()
      await this.$strapi.logout();
      localStorage.removeItem("jwt");
      this.$router.push("/");
    },
  },
};
</script>