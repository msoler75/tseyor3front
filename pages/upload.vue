<template>
    <form ref="form" @submit.prevent="enviar">
        <input type="text" name="titulo" value="titulo super chulo">
        <textarea name="descripcion" required>Esto es una descripcion corta</textarea>
        <textarea name="texto" required>Esto es una descripcion larga</textarea>
        <InputDateTime name="fechaComienzo" v-model="fechaComienzo" required />
        <input type="file" ref="image" name="imagen" required>
        <button class="btn" type="submit">Enviar</button>
    </form>
</template>


<script>
export default {
    data() {
        return {
            fechaComienzo: this.$dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')
        }
    },
    methods: {
        enviar() {
            const formElement = this.$refs.form
            console.log('formElement', formElement)
            console.log('fileimageElement', this.$refs.image)
            console.log('fileimageElement.file', this.$refs.image.files, typeof this.$refs.image.value)

            const formData = new FormData()

            formData.append("files", this.$refs.image.files[0])
            console.log('FUKE', this.$refs.image.files[0])
            this.$strapi.upload(formData)
            /*this.$axios.post('/upload', formData)
                .then((data) => {
                    console.log('UPLOAD SUCCESS', data)
                })
                .catch(err => {
                    console.warn(err)
                })*/

        }
    }
}</script>