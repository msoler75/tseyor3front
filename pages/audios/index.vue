<template>
  <section>
    <h1 class="text-center">Audios de Tseyor</h1>
    <client-only>
      <AudioPlayer v-if="currentAudio && currentAudio.src"
        autoplay
        :music="currentAudio"
        @canplay="canplay"
        class="max-w-md mx-auto"
        />
    </client-only>
    <section class="flex mt-6">
      <div class="w-full md:w-2/3">
        <div class="w-full flex mb-3">
          <div class="block xl:flex w-full">
            <Tabs
              v-model="viendoCategoria"
              :labels="categorias"
              :group="false"
            />
            <div class="xl:ml-auto">
              <SearchInput v-model="buscarPor" class="w-64 xl:mb-0" placeholder="Buscar audio..."/>
            </div>
          </div>
        </div>
        <div>
          <Card
            v-for="audio of audiosFiltrados"
            :key="audio.src"
            @click.native="play(audio)"
            class="p-2 mt-2 cursor-pointer"
          >
             <div> <icon icon="music" class="text-gray mr-1" /> {{ audio.titulo }}</div>
          </Card>
        </div>
      </div>
      <div class="hidden lg:block">
        <img src="/images/meditando.png" class="w-full" />
      </div>
    </section>
  </section>
</template>

<script>
export default {
  asyncData({ app }) {
    const audios = [];
    for (let i = 1; i < 56; i++) {
      const tags = [];
      if (i % 3 === 2) tags.push("meditaciones");
      if (i % 4 === 0) tags.push("talleres");
      if (i % 5 === 1) tags.push("reflexiones");
      if (i % 11 === 4) tags.push("cuentos");
      if (i % 7 === 3) tags.push("musica");
      audios.push({
        id: i,
        clase: "audios",
        titulo: app.$lorem(1),
        descripcion: app.$lorem(1),
        src: "/audios/audio" + i + ".mp3",
        tags
      });
    }
    return { audios };
  },
  data() {
    return {
      buscarPor: "",
      viendoCategoria: "todos",
      categorias: [
        "todos",
        "meditaciones",
        "talleres",
        "reflexiones",
        "cuentos",
        "musica"
      ]
    };
  },
  computed: {
    currentAudio() {
      return this.$store.state.audioPlaying;
    },
    audiosFiltrados() {
      const v = this.viendoCategoria.toLowerCase();
      const bp = this.$slugify(this.buscarPor);
      return this.audios.filter(
        audio =>
          (v === "todos" || audio.tags.includes(v)) &&
          (bp === "" ||
            this.$slugify(audio.titulo).search(bp) > -1 ||
            this.$slugify(audio.descripcion).search(bp) > -1)
      );
    },
    colorPlayer() {
      return this.$colorMode.value === "light" ? "blue" : "orange";
    }
  },
  methods: {
    play(audio) { 
      console.log("play", audio);
      this.$store.commit("setAudioPlay", {
        title: audio.titulo,
        artist: "TSEYOR",
        src: audio.src
      });
    },
    canplay() {
      console.log("canplay");
      const audio = document.querySelector('audio[src^="https://tseyor"]');
      if (audio) {
        // if (audio.paused || audio.ended) 
        // audio.play();
      }
    },
  }
};
</script>
