<template>
  <div class="container w-96 mx-auto">
    <h1>Archivos</h1>
    <div class="flex flex-col">
      <div
        v-for="archivo of archivos"
        :key="archivo.nombre"
        class="w-full surface border-gray-200 border-b py-2 px-3"
      >
        <div class="flex w-full">
          <div
            class="flex w-24 mr-3 uppercase font-bold bg-blue-300 text-blue-300-contrast justify-center items-center text-4xl"
          >
            {{ archivo.ext }}
          </div>
          <div class="w-full">
            <div>{{ archivo.nombre }}</div>
            <div class="flex w-full justify-between">
              <span class="text-diminished uppercase">{{ archivo.ext }}</span>
              <span class="ml-auto">{{ archivo.kb }} Kb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang>
export default {
  async asyncData({ app }) {
    // fetch our article here
    const archivos = [];
    const extensiones = ["mp3", "pdf", "rtf", "jpg"];
    for (let i = 1; i < 19; i++) {
      const ext = extensiones[(i * 17) % extensiones.length];
      archivos.push({
        nombre: "archivo " + i,
        ext,
        kb: ((i * i * 98123) % 323) * 1493
      });
    }
    return { archivos };
  }
};
</script>
