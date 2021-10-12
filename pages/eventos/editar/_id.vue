<template>
  <div>
    <h1>{{ accion }} evento</h1>
    <form @submit.prevent="submit" class="space-y-3">
      <div>
        {{ evento }}
      </div>
      <div>
        <label for="titulo">Título:</label><br />
        <input type="text" id="titulo" v-model="contenido.titulo" />
      </div>
      <div>
        <label for="descripcion">Descripción corta:</label><br />
        <textarea id="descripcion" v-model="contenido.descripcion" />
      </div>
      <div>
        <label for="texto">Descripción detallada:</label><br />
        <textarea id="texto" v-model="contenido.texto" />
      </div>
      <div v-if="!image">
        <h2>Select an image</h2>
        <input type="file" @change="onFileChange" />
      </div>
      <div v-else>
        <img :src="image" class="max-w-sm max-h-xs" />
        <button class="btn btn-gray text-xs mt-1" @click="removeImage">
          Remover imagen
        </button>
      </div>
      <div>
        <input class="btn" type="submit" :value="verbo" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  async asyncData ({ $strapi, route }) {
    let id = route.params.id
    let contenido = {
      titulo: '',
      texto: '',
      descripcion: '',
      zonahoraria: 'Espana',
      fechaComienzo: null,
      fechaFinal: null,
      imagen: null,
      tipoEvento: 'encuentro',
      sala: null,
      organiza: null
    }
    if (id && id !== 'nuevo') {
      const eventos = await $strapi.find(
        'eventos',
        id.match(/\d+/) ? { id } : { slug: id }
      )
      contenido = eventos[0]
    }
    return { contenido, evento: contenido }
  },
  data () {
    return {
      image: null
    }
  },
  computed: {
    accion () {
      return this.contenido.id ? 'Editar' : 'Nuevo'
    },
    verbo () {
      return this.contenido.id ? 'Guardar' : 'Crear'
    }
  },
  methods: {
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage (file) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      this.image = ''
    },
    submit () {
      if (this.contenido.id)
        this.$strapi
          .update('eventos', this.contenido.id, this.contenido)
          .catch(err => {
            console.log(err)
          })
      else
        this.$strapi.create('eventos', this.contenido).catch(err => {
          if (err.response.data.message === 'ValidationError') {
            const errors = err.response.data.data.errors
            for (const field in errors) {
              console.log('field: ', field)
              console.log(errors[field][0])
            }
          }
          console.log(err)
          console.log('message', err.message)
          console.log('response', err.response)
          console.log(JSON.stringify(err.response))
        })
    }
  }
}
</script>
