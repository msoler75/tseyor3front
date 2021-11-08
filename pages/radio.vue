<template>
  <div>
    <div class="flex flex-wrap justify-start">
      <div class="mr-9 w-auto">
        <img class="w-24" src="~/assets/svg/radio-tseyor.svg" />
      </div>
      <div>
        <h1>Radio Tseyor</h1>
        <p>Emisoras de radio las 24 horas del día los 7 días de la semana.</p>
      </div>
        <client-only>
      <AudioPlayer
        v-if="currentAudio && currentAudio.src"
        autoplay
        :float="true"
        :music="currentAudio"
        @ended="mediaEnded"
        @play="playEvent"
        @canplay="canplay"
        class="max-w-md mx-auto"
      />
    </client-only>
    </div>
    <divider />
    <div class="block md:flex justify-center">
      <Card class="p-6 w-full md:w-1/2 md:mr-5">
        <h2>Elige tu emisora:</h2>
        <div class="my-4">
          <div v-for="emisora of emisoras" :key="emisora.nombre" class="mb-5">
            <h3>{{ emisora.nombre }}</h3>
            <p>{{ emisora.descripcion }}</p>
            <button
              @click="selectStation(emisora)"
              class="my-3 btn"
            >
              Escuchar Emisora
            </button>
          </div>
        </div>
      </Card>
      <div>
        <img src="/imagenes/mujer-relajada.png" />
      </div>
    </div>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    const r = {
      beginOffset: 0,
      needToOffset: true,
      endpoint: "/tseyor/radio.php", //"https://tseyor.org/radio.php",
      emisoras: [
        {
          nombre: "Comunicados",
          descripcion:
            "Escucha comunicados desde los comienzos del grupo Tseyor",
          station: "default"
        },
        {
          nombre: "Meditaciones y Talleres",
          descripcion:
            "Relájate y ponte en sintonía con los talleres guiados, meditaciones y cuentos de las estrellas...",
          station: "meditaciones"
        }
      ],
      // SEO:
      title: 'Radio Tseyor',
      description: 'Escucha nuestra radio 24/7',
      image: 'imagen_a_definir'
    };
    r.emisoraActiva = r.emisoras[0];
    return r;
  },
  computed: {
    currentAudio() {
      return this.$store.state.audioPlaying;
    }
  },
  methods: {
    selectStation(emisora) {
      this.emisoraActiva = emisora;
      this.playNextAudio();
    },
    playNextAudio() {
      console.log("playNextAudio");
      this.$axios
        .get(
          `${this.endpoint}?station=${this.emisoraActiva.station}&station-name=${this.emisoraActiva.nombre}`
        )
        .then(response => {
          console.log(response);
          this.needToOffset = true;
          this.beginOffset = response.data.offset;
          this.play(
            "https://tseyor.org" + response.data.current,
            response.data.title
          );
        });
    },
    play(src, titulo) {
      console.log("play", src, titulo);
      this.$store.commit("setAudioPlay", {
        title: titulo,
        artist: "TSEYOR",
        src
      });
    },
    mediaEnded() {
      console.log("mediaEnded");
      this.playNextAudio();
    },
    canplay() {
      console.log("canplay");
      const audio = document.querySelector('audio[src^="https://tseyor"]');
      if (audio) {
        if (audio.paused) audio.play();
      }
    },
    playEvent() {
      console.log("playEvent");
      if (this.needToOffset) this.setOffset();
    },
    setOffset() {
      console.log("setOffset");
      if (this.needToOffset) {
        const audio = document.querySelector('audio[src^="https://tseyor"]');
        if (audio) {
          audio.currentTime = this.beginOffset;
          if (audio.paused) audio.play();
        }
        this.needToOffset = false;
      }
    }
  }
};
</script>
