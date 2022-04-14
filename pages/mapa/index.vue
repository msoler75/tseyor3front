<template>
  <div>
    <h1 class="text-center">¿Dónde Estamos?</h1>
    <div class="flex flex-wrap text-center items-stretch justify-center">
      <div v-for="info of infoClases" :key="info.titulo" class="p-2 max-w-sm">
        <Card class="p-5 rounded-xl h-full">
          <icon 
          :icon="info.icon"
          class="mx-auto text-3xl my-2 text-gray"
          />
        <h2>{{info.title}}</h2>
        <p>
          {{info.text}}
        </p>
        </Card>
      </div>
    </div>
    <section class="mt-5 mb-2">
      <Tabs v-model="viendoPais" :items="paises" group />
      <section class="flex flex-wrap justify-between text-sm">
        <Tabs compact group="fixed" v-model="viendoVista" :items="modosVista" class="text-md"/>
        <Tabs compact group="fixed" v-model="viendoClase" :items="modosClase" class="text-xs" /> 
            <SearchInput
              v-model="buscarPor"
              class="w-64"
              placeholder="Buscar..."
            />
      </section>
      
      
    </section>
  
  <section :key="mapKey" v-if="(viendoVista === 'Mapa')">
  
      <GMap
        ref="gMap"
        language="es"
        :cluster="{ options: { styles: clusterStyle } }"
        :center="locationsCenter"
        :options="{ fullscreenControl: true, styles: mapStyle }"
        :zoom="3"
      >
        <GMapMarker
          v-for="location in locations"
          :key="location.clase+'-'+location.id"
          :position="{ lat: location.lat, lng: location.lng }"
          @click="currentLocation = location"
        >
          <GMapInfoWindow :options="{ maxWidth: 200 }">
            <div class="flex flex-col items-center text-center">
            <nuxt-img class="rounded-full" width="50" height="50" 
            :src="
              location.clase === 'centros'
                ? '/imagenes/' + location.imagen
                : '/imagenes/usuarios/' + location.imagen
            "
            />
            <p class="font-bold text-sm">
              <NLink :to="location.href" >{{location.nombre}}</Nlink></p>
            </div>
          </GMapInfoWindow>
        </GMapMarker>
      </GMap>
      </section>

      <Grid  class="grid-cols-fill-w-48 text-center" v-else-if="viendoVista === 'Listado'">
        <Card v-if="!contactosFiltrados.length" class="p-7 flex items-center">
          <p>No hay resultados</p>
        </Card>
        <Card
        v-else
          v-for="contacto of contactosFiltrados"
          :key="contacto.clase + '-' + contacto.id"
          class="p-3 text-center"
        >
          <nuxt-img
            :src="
              contacto.clase === 'centros'
                ? '/imagenes/' + contacto.imagen
                : '/imagenes/usuarios/' + contacto.imagen
            "
            class="mx-auto mb-3 w-20 h-20 rounded-full"
          />
          <h3><NLink :to="contacto.href" >{{ contacto.nombre }}</Nlink></h3>
          <p class="text-lg">{{ contacto.pais }}</p>
          <p v-if="contacto.ciudad" class="text-diminished">
            {{ contacto.ciudad }}
          </p>
        </Card>
      </Grid>
    </section>
  </div>
</template>

<script>
import seo from '@/mixins/seo.js'
export default {
 mixins: [seo],
  asyncData({ app }) {
    const paises = [
      "España",
      "Chile",
      "Panamá",
      "México",
      "Venezuela",
      "Argentina",
      "Colombia",
      "Costa Rica",
      "Bolivia",
      "Ecuador",
    ];
    const contactos = [];
    for (let i = 1; i < 70; i++) {
      const str = i % 4 === 0 ? "Muulasterio " : "Casa ";
      const pais = paises[(i * i * 13) % paises.length];
      const clase = i % 14 === 9 ? "centros" : "usuarios";
      contactos.push({
        id: i,
        clase,
        imagen:
          clase === "centros"
            ? "imagen" + ((i % 8) + 1) + ".jpg"
            : "usuario" + ((i % 7) + 1) + ".jpg",
        pais,
        nombre:
          clase === "centros"
            ? str + "Tseyor " + app.$lorem(1, 1, 3)
            : app.$lorem(1, 1, 3),
        ciudad: app.$lorem(1, 1, 2),
        lat: Math.random() * 60 - 30,
        lng: Math.random() * 60 - 30,
      });
    }
    return { contactos };
  },
  data() {
    return {
      infoClases: [
        {
          icon: "fas fa-home",
          title: "Centros Tseyor",
          text: "Nuestros centros son las Casas Tseyor y Muulasterios Tseyor, que estamos conformando en todo el mundo, y que próximamente darán paso a los Pueblos Tseyor.",
        },
        {
          icon: "fas fa-user",
          title: "Miembros de Tseyor",
          text: " Puedes consultar todos los miembros de Tseyor que ofrecen su servicio de información, ayuda y apoyo en sus zonas de actividad.",
        },
      ],
      buscarPor: "",
      viendoPais: "Mundo",
      viendoVista: "Mapa",
      viendoClase: "Ambos",
      modosClase: ["Personas", "Centros", "Ambos"],
      modosVista: [
        { icon: "fas fa-map-marked-alt", label: "Mapa" },
        {
          icon: "fas fa-th-large",
          label: "Listado",
        },
      ],
      //opciones GMap
      currentLocation: {},
      /* pins: {
                selected: "data:image/png;base64,iVBORw0KGgo...",
                notSelected: "data:image/png;base64,iVBORw0KGgo..."
            }, */
      mapStyle: [],
      clusterStyle: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff",
        },
      ],
      // SEO:
      title: 'Mapa',
      description: 'Dónde está Tseyor en el mundo',
      image: 'imagen_a_definir'
    };
  },
  computed: {
    paises() {
      const r = { Mundo: true };
      for (const centro of this.contactos) r[centro.pais] = true;
      return Object.keys(r);
    },
    contactosFiltrados() {
      const v = this.viendoPais.toLowerCase();
      const bp = this.$slugify(this.buscarPor);
      const vc = this.viendoClase.toLowerCase().replace("personas", "usuarios");
      return this.contactos
        .filter(
          (contacto) =>
            (v === "mundo" || contacto.pais === this.viendoPais) &&
            (bp === "" ||
              this.$slugify(contacto.nombre).search(bp) > -1 ||
              this.$slugify(contacto.ciudad).search(bp) > -1 ||
              this.$slugify(contacto.pais).search(bp) > -1)
        )
        .filter((contacto) => vc === "ambos" || vc === contacto.clase)
        .map(x=>{return {...x, href: `/${x.clase.replace('centros', 'mapa')}/${x.id}`
        }})
    },
    locations() {
      return this.contactosFiltrados;
    },
    locationsCenter() {
      let lat = 0;
      let lng = 0;
      if (!this.locations.length) return { lat, lng };
      this.locations.map((x) => {
        lat += x.lat;
        lng += x.lng;
      });
      return {
        lat: lat / this.locations.length,
        lng: lng / this.locations.length,
      };
    },
    mapKey() {
      return this.hashCode(JSON.stringify(this.locations));
    },
  },
  methods: {
    hashCode(str) {
      var hash = 0;
      if (!str || str.length == 0) {
        return hash;
      }
      for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    },
  },
};
</script>
