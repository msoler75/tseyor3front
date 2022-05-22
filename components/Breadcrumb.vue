<template>
  <ul
    class="breadcrumb list-none flex flex-wrap select-none"
    vocab="http://schema.org/"
    typeof="BreadcrumbList"
    :class="
      backgroundImageUrl
        ? 'text-gray mix-blend-difference'
        : 'text-diminished dark:text-gray-100'
    "
  >
    <li
      v-for="(crumb, index) of crumbs"
      :key="crumb.href"
      class="flex items-center"
      property="itemListElement"
      typeof="ListItem"
    >
      <NLink
        v-if="crumb.href"
        :to="crumb.href"
        event
        @click.native="navigate($event, crumb)"
        class="
          transition
          duration-200
          opacity-70
          hover:opacity-100
          flex
          items-center
        "
      >
        <div
          v-if="crumb.icon"
          class="icon inline-flex opacity-70 justify-center items-center"
        >
          <icon :icon="crumb.icon" />
        </div>
        <span property="name" class>{{ crumb.name }}</span>
      </NLink>
      <div v-else class="flex items-center">
        <div
          v-if="crumb.icon"
          class="icon inline-flex opacity-70 justify-center items-center"
        >
          <icon :icon="crumb.icon" />
        </div>
        <span property="name" class>{{ crumb.name }}</span>
      </div>
      <icon
        v-if="index < crumbs.length - 1"
        icon="caret-right"
        class="mx-1 opacity-30"
      />
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      newKey: 1,
    };
  },
  methods: {
    navigate(event, crumb) {
      console.log("breadcrumb navigate!", event, crumb);
      if (crumb.click) {
        console.log("has click");
        return crumb.click(event);
      }
      console.log("current route", this.$route.fullPath);
      console.log("no click function, so we route to ", ruta);
      let ruta = crumb.href;
      if (this.breadcrumbHandler){
        console.log('breadcrumbHnalder!!')
        this.breadcrumbHandler(ruta);
      } 
      else {
        if (this.$route.fullPath !== ruta) this.$router.push(ruta);
        else this.$router.go({ path: ruta, force: true });
      }
      //this.$nuxt.refresh()
    },
    merge(arr1, arr2) {
      if (!arr1) return arr2;
      if (!arr2) return arr1;
      for (const e of arr2) {
        let found = false;
        const se = JSON.stringify(e);
        for (const k of arr1) {
          if (se === JSON.stringify(k)) found = true;
        }
        if (!found) arr1.push(e);
      }
      return arr1;
    },
    crumbsRecursive(path) {
      if (typeof path !== "string") return [];
      let r = [];
      let crumb = this.$store.getters.getRouteData(path);
      if (crumb && (crumb.name || crumb.icon)) {
        if (path !== "/")
          r = this.crumbsRecursive(crumb.parent ? crumb.parent : "/");
        if (crumb.href !== "/") r.push(crumb);
        return r;
      }
      return [];
    },
  },
  computed: {
    ...mapGetters(["breadcrumbHandler", "backgroundImageUrl"]),
    crumbs() {
      if (process.client) {
        const pathShowing =
          this.$store.getters.getPathBreadcrumb || this.$route.fullPath;
        // console.log('typeof', typeof pathShowing, pathShowing)
        if (typeof pathShowing === "object") return pathShowing;
        const path = pathShowing.replace(/\/\d+(\/editar)?$/, "");
        let r = this.crumbsRecursive(path);
        if (r.length) return r;
        const parts = path.split("/").filter((x) => x.length && x !== "*");
        r = [];
        for (var i = 0; i < parts.length; i++) {
          let try_path =
            i + 1 < parts.length ? parts[i] + "/" + parts[i + 1] : parts[i];
          let tmp = this.crumbsRecursive("/" + try_path);
          if (!tmp.length && i + 1 < parts.length) {
            try_path = parts[i];
            tmp = this.crumbsRecursive("/" + try_path);
          }
          if (tmp.length) {
            if (try_path.indexOf("/") >= 0) i++;
            r = this.merge(r, tmp);
          }
        }
        return r;
      } else return [];
    },
  },
  jsonld() {
    if (!this.crumbs.length) return null;
    const items = this.crumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": item.href,
        name: item.name,
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  },
};
</script>

<style scoped>
/* ul.breadcrumb li:last-child a {display: none !important} */
.icon {
  width: 1.75em;
}
svg {
  display: inline-block;
}
.breadcrumb >>> svg {
  display: inline;
  width: 1rem;
}
/* BPASS capitel 737857 */
</style>
