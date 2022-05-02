<template>
  <div breadcrumb="no" >

    <h1 class="text-center">Normativas</h1>

    <section class="flex flex-col items-center justify-center flex-wrap sm:flex-nowrap mb-5">
      <Tabs ref="tabs" v-model="viendoCategoria" :items="categorias" class="mb-7 justify-center" />

      <form @submit.prevent="buscar" class="w-auto flex justify-end order-1">
        <SearchInput
          v-model="buscarPor"
          class="w-48"
          placeholder="Título o palabras clave"
          required
          @search="buscar"
        />
        <button :disabled="buscarPor.length <= 3" type="submit" class="ml-2 btn">
          Buscar
          <span class="hidden md:inline">en Normativas</span>
        </button>
      </form>
    </section>

    <Card class="p-5 max-w-md mx-auto">
      <div v-if="buscandoPor" class="mb-5">
        <p v-if="buscandoPor" class="text-center font-bold">Viendo resultados de: {{ buscandoPor }}</p>
        <p v-else>&nbsp;</p>
      </div>
      <ul v-if="normativasFiltradas.length" class="list-disc pl-5">
        <li v-for="norm of normativasFiltradas" :key="norm.id">
          <NLink :to="'/normativas/' + norm.slug">{{ norm.titulo }}</NLink>
        </li>
      </ul>
      <div v-else class="mb-16">
        <p>No hay resultados.</p>
      </div>
    </Card>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ route, $strapi, $error }) {
    try {
      const {data:normativas, meta, error} = await $strapi.findList(route)
      if (!normativas)
        return $error(error && error.status ? error.status : 503)
      return { normativas, meta }
    } catch (e) {
      console.error(e)
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: '',
      buscandoPor: '',
      viendoCategoria: "Todo",
      categorias: ["Todo", "Estatutos", "Normativas", "Documentos Legales"],
      // SEO:
      title: 'Normativas',
      description: 'Todas las normativas, reglamentos, protocolos y estatutos de Tseyor',
      image: 'imagen_a_definir'
    }
  },
  computed:
  {
    normativasCategoria() {
      let c = this.viendoCategoria.toLowerCase()
      if (!c || c === "todo") return this.normativas;
      if (c === "normativas")
        return this.normativas.filter(
          x => ["normativa", "protocolo", "acuerdo", "anexo"].includes(x.tipo)
        );
      if (c === "estatutos")
        return this.normativas.filter(
          x => ["estatuto"].includes(x.tipo)
        );
      if (c === "documentos legales")
        return this.normativas.filter(
          x => ["legal"].includes(x.tipo)
        );
      c = c.replace(/s$/, '')
      return this.normativas.filter(x => x.tipo === c);
    },
    normativasFiltradas() {
      const listado = this.normativasCategoria
      const bp = this.buscandoPor
      if (!bp) return listado
      const fuse = new Fuse(listado, {
        keys: ["titulo", "tipo", "descripcion", "texto"],
        threshold: 0.3,
        shouldSort: true
      });
      return fuse.search(bp).map(({ item }) => item)
    }
  },
  methods:
  {
    buscar() {
      this.buscandoPor = this.buscarPor
    }
  }
}
</script>
