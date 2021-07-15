<template>
  <div class="container max-w-4xl mx-auto">
    <div class="flex mb-5 items-center">
        <div class="mr-4">
            <h1>Archivo de Comunicados</h1>
            <p>Todos los comunicados archivados desde el año 2004 excepto <NLink to="/comunicados">los más recientes</NLink></p>
        </div>
        <div class="ml-auto">
            <NLink to="/comunicados" class="btn py-3"><i class="fas fa-arrow-right mr-2"/> Últimos comunicados</NLink>
        </div>
    </div>
    
    <divider />

    <div class="card px-3 xl:px-5 rounded p-2 grid gap-4"
    style="grid-template-columns: 40px 100px 100px 4fr 1fr 1.5fr"> 
    <template v-for="(com, idx) of listado"  >
        <div :key="idx+'a'">{{com.num}}</div>
        <div :key="idx+'b'">{{com.tipostr}}</div>
        <div :key="idx+'c'">{{com.fechalarga}}</div>
        <div :key="idx+'d'">{{com.titulo}}</div>
        <div :key="idx+'e'"><a :href="'https://tseyor.org/biblioteca/comunicados/pdf1/TSEYOR '+com.pdf+'.pdf'" class="btn btn-error" download>
        <i class="fas fa-file-pdf mr-2"/>PDF</a></div>
        <div :key="idx+'f'" class="flex overflow-x-auto">
            <div v-for="audio of com.mp3" :key="audio.src" class="btn mr-2"
            @click="play(audio.src)">{{audio.title}}</div>
            </div>
    </template>
    </div>  
  </div>
</template>

<script>
import dataraw from "raw-loader!@/content/comunicados.txt";
export default {
  data() {
    return {
      comunicadosraw: dataraw,
      comunicados: [],
      fields: [
        { name: "com", title: "Nº" },
        {
          name: "tipostr",
          title: "Tipo"
        },
        {
          name: "fechaLarga",
          title: "Fecha"
        },
        {
          name: "titulo",
          title: "Título"
        },
        {
          name: "pdf",
          title: "PDF"
        },
        {
          name: "mp3",
          title: "Audios"
        }
      ]
    };
  },
  mounted() {
    this.prepare_data();
  },
  computed: {
    listado() {
      return this.comunicados.slice(0, 1200);
    }
  },
  methods: {
    prepare_data() {
      const _comrows = this.comunicadosraw.split(/[\r\n\t#]+\s*/);
      var numrow = 0;
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
        var fechacorta = tmp[2] + "/" + tmp[1] + "/" + tmp[0];
        var fechalarga = tmp[2] + "/" + tmp[1] + "/20" + tmp[0];
        var fechanum = parseInt(tmp[0] + tmp[1] + tmp[2]);
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
              src: "https://tseyor.org/biblioteca/comunicados/audios/TSEYOR " + link + ".mp3",
              title: "AUDIO " + nummp3
            });
          }
        } else mp3 = [];

        var row = {
          idx: numrow,
          num: num,
          com: parseInt(num),
          tipo: tipo.toLowerCase(),
          tipostr: tipostr,
          fechanum: fechanum,
          fecha: fecha,
          fechalarga: fechalarga,
          titulo: titulo,
          pdf: pdf,
          mp3: mp3
        };
        this.comunicados.push(row);
        numrow++;
      }
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
