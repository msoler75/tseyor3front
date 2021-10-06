<template>
    <NLink v-if="cto" :to="cto" class="block flex-shrink-0 rounded-full overflow-hidden border dark:border-gray-100">
        <nuxt-img v-if="cimage" :src="cimage" class="shadow w-full h-full" :alt="cname" :title="cname"/>
        <div v-else class="h-full flex justify-center items-center shadow uppercase" :style="'background: ' + color">
            {{initials}}
        </div>
    </NLink>
    <nuxt-img v-else-if="cimage" :src="cimage" class="block flex-shrink-0 rounded-full shadow w-full h-full border dark:border-gray-100" :alt="cname" :title="cname"/>
    <div v-else class="flex-shrink-0 rounded-full overflow-hidden flex justify-center items-center shadow uppercase border dark:border-gray-100" :style="'background: ' + color">
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
      type: String | Object,
      required: false,
      default: null,
    },
    to: {
      type: String | Boolean,
      required: false,
      default: null
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
        if(this.to===false)
        return null
          if(this.to)
            return this.to
          if(this.cid)
            return `/usuarios/${this.cid}`
          return null
      },
    cimage() {
      let image = this.data?this.data.image|| this.data.imagen:this.image
      if(!image) return image
      if(typeof image === 'object')
        return image.url || image.href || image.src
      return image
    },
    cname() {
        if(this.data)
        {
          let name = this.data.name || this.data.nombreSimbolico || this.data.username || this.data.nombre || this.data.user ||this.data.usuario 
          if(!name&& this.data&& this.data.email)
            name = this.data.email.replace(/@.*/, '')
          return name || ''
        }
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