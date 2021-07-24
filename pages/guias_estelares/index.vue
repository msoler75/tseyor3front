<template>
  <Grid class="grid-cols-fill-w-40 text-center">
    <div v-for="guia of nombres" :key="guia" class="p-3">
      <NLink :to="'guias_estelares/' + guia.toLowerCase().replace(' ', '_')">
        <h2 class="text-lg mb-2">{{ guia }}</h2>
        <nuxt-img
          loading="lazy"
          :alt="guia"
          :src="'images/guias/' + guia.toLowerCase().replace(' ', '') + '.jpg'"
          width="200px"
          height="320px"
          class="hidden sm:block mx-auto"
        />
      </NLink>
    </div>
  </Grid>
</template>

<script>
export default {
  data() {
    return {
      guias: [
        "aium om",
        "alux pen",
        "aumnor",
        "eanur om",
        "exael",
        "icotrem",
        "jalied",
        "melcor",
        "melinus",
        "mo",
        "noiwanak",
        "olion",
        "orjain",
        "orsil",
        "ostracita",
        "peques",
        "rasbek",
        "rhaum",
        "seiph",
        "shilcars",
        "silinur",
      ],
    };
  },
  methods: {
    capitalize(str) {
      const words = str.split(" ");
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
    },
  },
  computed: {
    nombres() {
      return this.guias.map(x => this.capitalize(x));
    },
  },
};
</script>

