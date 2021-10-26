<template>
  <div class="container max-w-4xl mx-auto" contained="no">

    <div class="px-1 xs:px-3 sm:px-7">
      <div class="mb-7">
        <h1>Archivo de Comunicados</h1>
        <p>
          Todos los comunicados archivados desde el año 2004 excepto 
          <NLink to="/comunicados" class="btn btn-gray py-1 px-2 inline-block whitespace-nowrap font-light">los más recientes</NLink>
        </p>
      </div>
    </div>

    <Card class="overflow-hidden rounded-none lg:rounded my-7">
      <div class="py-4 px-1 xs:px-2 sm:px-5 md:px-7 bg-transparent w-full max-w-none flex space-x-2 xs:space-x-4 sm:grid sm:grid-cols-3 gap-2 justify-between items-center">
        <div class="pagination text-xs xs:text-sm sm:text-base whitespace-nowrap">
          <button @click="pagina=1" class="hidden xm:inline btn btn-gray" :disabled="pagina===1"><icon icon="step-backward"/></button>
          <button @click="decPagina()" class="btn btn-gray" :disabled="pagina===1"><icon icon="caret-left" /></button>
          <input type="number" v-model="pagina" class="!px-0 xs:!px-1 !w-6 sm:!w-10 lg:!w-12 text-center appearance-none inline"/>
          <button @click="incPagina()"  class="btn btn-gray" :disabled="pagina===totalPaginas"><icon icon="caret-right" /></button>
          <button @click="pagina=totalPaginas"  class="hidden xm:inline btn btn-gray" :disabled="pagina===totalPaginas"><icon icon="step-forward"/> </button>

        </div>
        <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 justify-center items-center">
          <div
            class="relative inline-block w-10 align-middle select-none"
          >
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              v-model="ordenarPorRecientes"
              class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in right-1/2"
            >
            <label
              for="toggle"
              class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-400 cursor-pointer transition-all duration-200 ease-in"
            ></label>
          </div>
          <label for="toggle" class="text-xs sm:text-sm md:text-base text-gray-700"><span class="hidden md:inline">Ver </span>Recientes</label>
        </div>
        <div class="flex justify-end items-center">
          <SearchInput class="!w-32 xm:!w-full md:!w-60" placeholder="Buscar número, título, tipo..." v-model="filtrarPor"/>
        </div>
      </div>
      <table
        v-if="preparado"
        class="rounded text-xs xs:text-sm lg:text-base table-auto relative w-full border-collapse"
      >
        <thead>
          <th>
            <span class="xs:hidden">#</span>
            <span class="hidden xs:block md:hidden">Num.</span>
            <span class="hidden md:block">Número</span>
          </th>
          <th class="hidden sm:table-cell">Tipo</th>
          <th class="hidden xm:table-cell">Fecha</th>
          <th class="text-left">Título</th>
          <th><span class="hidden sm:block">PDF</span></th>
          <th><span class="hidden sm:block">Audios</span></th>
        </thead>
        <tbody class="divide-y divide-blue-gray-50 dark:divide-gray-900">
          <tr
            v-for="(com, idx) of listadoPaginado"
            :key="idx"
            class="transition duration-150 lg:bg-gray-50 lg:hover:bg-white"
          >
            <td class="align-middle text-center">
              <div>{{ com.num }}</div>
              <div class="sm:hidden text-xs">{{ com.tipostr }}</div>
              <div class="xm:hidden text-xs whitespace-nowrap">
                {{ com.fechacorta }}
              </div>
            </td>
            <td class="hidden sm:table-cell align-middle text-center">{{ com.tipostr }}</td>
            <td class="hidden xm:table-cell align-middle text-center whitespace-nowrap">
              <div class="md:hidden">{{ com.fechacorta }}</div>
              <div class="hidden md:block">{{ com.fechalarga }}</div>
            </td>
            <td>{{ com.titulo }}</td>
            <td class="text-center">
              <a
                :href="
                  'https://tseyor.org/biblioteca/comunicados/pdf1/TSEYOR ' +
                    com.pdf +
                    '.pdf'
                "
                class="text-red dark:text-white sm:text-red-contrast sm:btn sm:btn-error text-3xl sm:text-sm sm:py-1 sm:px-2 whitespace-nowrap"
                download
              >
                <icon icon="file-pdf" class="sm:mr-2" /><span
                  class="hidden sm:inline"
                  >PDF</span
                ></a
              >
            </td>
            <td>
              <div
                class="flex items-center overflow-x-auto space-x-2 sm:space-x-3 max-w-[3rem] sm:max-w-[8rem] lg:max-w-none lg:w-[12rem] lg:space-x-0 lg:mx-auto lg:grid grid-cols-2 gap-2"
              >
                <div
                  v-for="audio of com.mp3"
                  :key="audio.src"
                  class="text-blue-700 dark:text-light-blue sm:text-blue-contrast sm:btn sm:bg-light-blue text-3xl sm:text-sm sm:py-1 sm:px-2 whitespace-nowrap"
                  @click="play(audio.src)"
                >
                  <icon icon="file-audio" class="sm:mr-2" /><span
                    class="hidden sm:inline"
                    >{{ audio.title }}</span
                  >
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
import dataraw from "raw-loader!@/content/comunicados.txt";
import Fuse from "fuse.js";
import seo from '@/mixins/seo.js'
export default {
  mixins: [seo],
  data() {
    return {
      comunicadosraw: dataraw,
      preparado: false,
      comunicados: [],
      filtrarPor: '',
      ordenarPorRecientes: false,
      pagina: 1,
      numPerPagina: 10,
      totalPaginas: 1,
      // SEO:
      title: 'Comunicados',
      description: 'Archivo de Comunicados',
      image: 'imagen_a_definir'
    };
  },
  mounted() {
    this.prepare_data();
  },
  computed: {
    listado() {
      return this.comunicados
    },
    listadoFiltrado() {
      const search = this.filtrarPor
      if(!search)
        return this.listado
      const fuse = new Fuse(this.listado, {
        keys: ["num", "titulo", "tipo", "tipostr", "fechalarga", "fechacorta"],
        threshold: 0.3,
        shouldSort: true
      });
      return fuse.search(search).map(({ item }) => item)
    },
    listadoOrdenado() {
      const recientes = this.ordenarPorRecientes
      return this.listadoFiltrado.sort((a,b)=>{
        return recientes?b.fecha.localeCompare(a.fecha):a.idx-b.idx
      })
    },
    listadoPaginado () {
      this.totalPaginas = Math.ceil(this.listadoOrdenado.length / this.numPerPagina)
      this.pagina = Math.max(1, Math.min(this.pagina, this.totalPaginas))
      return this.listadoOrdenado.slice((this.pagina-1)*this.numPerPagina, this.pagina*this.numPerPagina)
    }
  },
  methods: {
    incPagina() {
      if(this.pagina<this.totalPaginas)
      this.pagina++
    },
    decPagina() {
      if(this.pagina>1)
      this.pagina--
    },
    prepare_data() {
      const _comrows = this.comunicadosraw.split(/[\r\n\t#]+\s*/);
      for (var i = 0; i < _comrows.length - 1; i++) {
        //1029;1010;GEN;19/11/26;Ya es hora de empezar a tomarnos las cosas verdaderamente en serio;191126 (1010);191126 (1010) a,191126 (1010) b
        var data = _comrows[i]; /*.trim()*/
        if (!data || !data.length) continue;
        var parts = data.split(";");
        if (!parts[1]) continue;

        //var row = parts[0];
        var num = parts[0];
        var tipo = parts[1];
        var fecha = parts[2];
        var titulo = parts[3];
        var pdf = parts[4];
        var mp3 = parts[5];

        var tmp = fecha.split("/");
        var fechalarga = tmp[2] + "/" + tmp[1] + "/20" + tmp[0];
        var fechacorta = this.$dayjs(
          "20" + tmp[0] + "/" + tmp[1] + "/" + tmp[2]
        ).format("MMM-YY");
        //var fechanum = parseInt(tmp[0] + tmp[1] + tmp[2]);
        var tipostr = tipo;
        switch (tipo) {
          //case "PAB": tipostr = "Comunicados de Puertas Abiertas"; break;
          //case "JUN": tipostr = "Comunicados en el Ágora del Junantal"; break;
          //case "TRI": tipostr = "Comunicados a la Tríada"; break;
          case "TAP":
            tipostr = "TAP";
            break;
          case "MUL":
            tipostr = "Muul";
            break;
          case "DDM":
            tipostr = "<small>Doce del Muulasterio</small>";
            break;
          default:
            tipostr = "General";
        }

        if (typeof mp3 === "string" && mp3.length) {
          var links = mp3.split(",");
          var mp3 = [];
          for (var j in links) {
            var link = links[j];
            var nummp3 = links.length > 1 ? " " + (parseInt(j) + 1) : "";
            mp3.push({
              src:
                "https://tseyor.org/biblioteca/comunicados/audios/TSEYOR " +
                link +
                ".mp3",
              title: "Audio " + nummp3
            });
          }
        } else mp3 = [];

        var row = {
          idx: i,
          num: num,
          com: parseInt(num),
          tipo: tipo.toLowerCase(),
          tipostr,
          //fechanum,
          fecha,
          fechacorta,
          fechalarga,
          titulo,
          pdf: pdf,
          mp3: mp3
        };
        this.comunicados.push(row);
      }

      this.preparado = true
    },
    remove_accents(a) {
      var accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      var accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      str = a.split("");
      var strLen = str.length;
      var i, x;
      for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x];
        }
      }
      return str.join("");
    }
  }
};
</script>

<style scoped>
th {
  @apply bg-light-blue text-white py-3 px-2;
}
td {
  @apply py-2 px-2;
}

input.toggle-checkbox:checked {
  @apply: right-0 border-blue-400;
  right:0;
  border-color: #08f;
}
input.toggle-checkbox:checked + .toggle-label {
  @apply: bg-blue-400;
  background-color: #08f;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.pagination button {
  @apply p-1 xs:p-2 sm:py-2 sm:px-4 
}
</style>
