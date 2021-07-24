<template>
    <NLink v-if="cto" :to="cto" class="flex-shrink-0 rounded-full overflow-hidden">
        <nuxt-img v-if="cimage" :src="cimage" class="shadow w-full h-full" :alt="cname"/>
        <div v-else class="flex justify-center items-center shadow uppercase" :style="'background: ' + color">
            {{initials}}
        </div>
    </NLink>
    <nuxt-img v-else-if="cimage" :src="cimage" class="flex-shrink-0 rounded-full shadow w-full h-full" :alt="cname"/>
    <div v-else class="flex-shrink-0 rounded-full overflow-hidden flex justify-center items-center shadow uppercase" :style="'background: ' + color">
        {{initials}}
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    name: {
      type: String,
      required: false,
      default: null,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    to: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
      default() {
        // generamos un color random en base a los datos proporcionados
        const s = this.cname + this.cimage;
        let hash = 0;
        if (s.length === 0) {
          return "#000";
        }
        for (let i = 0; i < s.length; i++) {
          hash = s.charCodeAt(i) + ((hash << 5) - hash);
          hash = hash & hash;
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 255;
          color += ("00" + value.toString(16)).substr(-2);
        }
        return color;
      },
    },
    showState: {
      type: Boolean,
      required: false,
      default: false,
    },
    state: {
      required: false,
      validator(v) {
        return (
          v === null ||
          (typeof v === "string" && ["online", "busy", "away"].includes(v))
        );
      },
      default: null,
    },
  },
  computed: {
      cid () {
          return this.data?this.data.id:null
      },
      cto (){
          if(this.to)
            return this.to
          if(this.cid)
            return `/usuarios/${this.cid}`
          return null
      },
    cimage() {
        if(this.data)
        {
            const image = this.data.image || this.data.imagen
            if(image)
                return './assets/images/usuarios/'+image
        }
        return this.image
    },
    cname() {
        if(this.data)
            return this.data.name || this.data.nombre || this.data.user ||this.data.usuario || this.data.email.replace(/@.*/, '')
        return this.name || 'Anónimo'
    },
    initials() {
      const words = this.cname.split(" ");
      let inicialex = "";
      for (const w of words) {
        if (!["de", "en", "la", "pm"].includes(w)) {
          inicialex += w[0];
        }
      }
      // máximo 2 iniciales
      return inicialex.substr(0, 2).toUpperCase();
    },
  },
};
</script>