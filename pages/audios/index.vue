<template>
  <section>
    <h1 class="text-center">Audios de Tseyor</h1>
    <client-only>
      <AudioPlayer
        v-if="currentAudio && currentAudio.src"
        autoplay
        :music="currentAudio"
        @canplay="canplay"
        class="max-w-md mx-auto"
      />
    </client-only>
    <SwipeX v-model="viendoCategoria" :values="categorias" class="flex mt-6">
      <div class="w-full md:w-2/3">
        <div class="w-full flex mb-3">
          <div class="block xl:flex w-full">
            <Tabs
              v-model="viendoCategoria"
              :items="categorias"
              :group="false"
              class="xl:flex-wrap"
            />
            <div class="xl:ml-auto">
              <SearchInput v-model="buscarPor" class="w-64 xl:mb-0" placeholder="Buscar audio..." />
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
            <div>
              <icon icon="music" class="text-gray mr-2" />
              {{ audio.titulo }}
              <span
                v-if="audio.descripcion"
                class="text-diminished"
              >— {{ audio.descripcion }}</span>
            </div>
          </Card>
          <div
            v-show="hayMas && !cargando"
            v-observe-visibility="cargarMas"
            class="mt-3 flex justify-center"
          >
            <!-- <button @click="cargarMas" class="btn">Cargar Más...</button> -->
          </div>
        </div>
      </div>
      <div class="hidden lg:block">
        <img src="/imagenes/meditando.png" class="w-full" />
      </div>
    </SwipeX>
  </section>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  async asyncData({ $strapi, $error }) {
    try {
      const filters = {
        _start: 0,
        _limit: 20
      }

      const audios = await $strapi.find('audios', filters)

      return { audios, filters }
    }
    catch (e) {
      $error(503)
    }
  },
  data() {
    return {
      buscarPor: "",
      hayMas: true,
      cargando: false,
      viendoCategoria: "todos",
      categorias: [
        "todos",
        "meditaciones",
        "talleres",
        "reflexiones",
        "cuentos",
        "música",
        "clásica"
      ],
      // SEO:
      title: 'Audios',
      description: 'Talleres, meditaciones, reflexiones, música...',
      image: 'imagen_a_definir'
    };
  },
  computed: {
    currentAudio() {
      return this.$store.state.audioPlaying;
    },
    audiosFiltrados() {
      const v = this.viendoCategoria.toLowerCase().replace(/ú/, 'u');
      const bp = this.$slugify(this.buscarPor.replace(/ó/, 'o').replace(/ú/, 'u'));
      return this.audios.filter(
        audio =>
          (v === "todos" || audio.categoria.toLowerCase() === v) &&
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
    async cargarMas() {
      if (!this.hayMas) return
      this.filters._start = this.audios.length
      const filtro = this.buscarPor && this.buscarPor.length >= minLengthBuscar ? { ...this.filters, '_q': this.buscarPor } : this.filters
      this.cargando = true

      const audios = await this.$strapi.find('audios', filtro)

      this.hayMas = audios.length === this.filters._limit
      for (const audio of audios) {
        if (!this.audios.find(x => x.id === audio.id))
          this.audios.push(audio)
      }
      this.cargando = false
    },
    play(audio) {
      const src = audio.audio.url
      // console.log("play", mp3);
      this.$store.commit("setAudioPlay", {
        title: audio.titulo,
        artist: audio.descripcion,
        src
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
