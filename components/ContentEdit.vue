<template>
    <form @submit.prevent="onSubmit">

        <div v-if="content.id" class="max-w-md mx-auto mb-3 flex flex-col space-y-4">
            <Card class="p-3 !outline-2"
                :class="published ? '!bg-green-50 !text-green-900 outline-green-400' : '!bg-blue-50 !text-blue-900 !outline-blue-400'">
                <div>
                    <icon icon="circle" class="mr-1 transform scale-50" />
                    Editando <span v-if="content.publishedAt" class="font-bold">versión
                        publicada</span><span class="font-bold" v-else>borrador</span>
                </div>
            </Card>
        </div>

        <Card class="order-1 py-5 px-2 xs:px-4 max-w-md mx-auto bg-blue-gray-50 dark:bg-blue-gray-900">
            <div class="space-y-9">
                <h1>{{ verbAction }} {{ singular }}</h1>
                <slot :inputClassError="inputClassError" :errors="errors" />
            </div>
        </Card>

        <div
            class="surface surface-gray fixed bottom-0 left-0 right-0 overflow-x-autotext-sm !border-0 border-t z-30 shadow flex flex-col items-center py-3 space-y-3 px-2 text-xs xm:text-sm sm:text-base">

            <Card v-if="thereErrors" id="errors" class="p-3 bg-red-400 ">
                <p class="error font-bold !text-white">
                    <icon icon="exclamation-triangle" class="mr-2 transform scale-75" />
                    <span>{{ errors.message }}</span>
                </p>
            </Card>

            <div class="space-x-3 sm:space-x-6 flex justify-center ">

                <button class="btn w-auto text-center whitespace-nowrap" @click.prevent="onPublishButton"
                    :class="published ? 'btn-success' : 'btn-gray'"
                    :disabled="!content.id || deleting || saving || publishing || !!modified">
                    <div class="flex justify-center items-center w-20">
                        &nbsp;
                        <icon v-if="publishing" icon='sync spin' />
                        <span v-else class="inline-block w-28">
                            <icon v-if="published" icon='check' class="mr-2" />
                            <span>{{ verbPublish }}</span>
                        </span>
                    </div>
                </button>

                <button class="btn w-auto text-center" :class="modified && !publishing ? '' : 'btn-gray'" type="submit"
                    :disabled="deleting || saving || publishing || (!publishing && !modified)">
                    <div class="flex justify-center items-center w-14">
                        &nbsp;
                        <icon v-if="saving" icon='sync spin' />
                        <span v-else class="inline-block">{{ verbSave }}</span>
                    </div>
                </button>

                <div v-if="publishing || content.id && !published" @click="deleteContent"
                    class="btn btn-error w-auto text-center" :disabled="deleting || saving || publishing"
                    :title="`Borrar ${singular}`">
                    <div class="flex justify-center items-center">
                        <icon class="!w-3" icon="trash" />&nbsp;
                    </div>
                </div>

                <NLink v-if="content.id && published && !publishing" :to="`/${collection}/${content.id}`"
                    class="btn btn-gray w-auto text-center" :title="`Ver ${singular}`"
                    :disabled="deleting || saving || publishing">
                    <div class="flex justify-center items-center">
                        <icon class="!w-3" icon="eye" />&nbsp;
                    </div>
                </NLink>

            </div>

        </div>
    </form>
</template>

<script>
import validation from "@/mixins/validation"
export default {
    mixins: [validation],
    props: {
        content: {
            type: Object,
            required: true
        },
        collection: {
            type: String,
            required: true
        },
        masculine: {
            type: Boolean,
            required: false,
            default: true
        },
        error: {},
        value: {}
    },
    data() {
        return {
            // estados
            saving: false,
            publishing: false,
            deleting: false,
            modified: 0,
        }
    },
    computed: {
        singular() {
            return this.collection.replace(/e?s$/, '')
        },
        published() {
            return this.content.publishedAt
        },
        verbAction() {
            return this.content.id ? 'Editar' : 'Nuevo'
        },
        verbPublish() {
            return this.publishing ? 'Publicando' : !this.published ? 'Publicar' : 'Publicado'
        },
        verbSave() {
            return this.publishing ? 'Guardado' : this.saving ? 'Guardando' : this.modified ? 'Guardar' : 'Guardado'
        },
        contentJSON() {
            return JSON.stringify(this.content)
        },
        creando() {
            return !this.content || !this.content.id
        },
        refType() {
            return `${this.masculine ? 'el' : 'la'} ${this.singular}`
        }
    },
    watch: {
        contentJSON(newValue) {
            this.modified++;
        },
        modified(newValue) {
            this.$emit('change', { modified: this.modified, ...this.content })
        },
        error(newValue) {
            this.setErr(newValue)
        }
    },
    methods: {
        deleteContent() {
            this.$confirm({
                message: `Esto eliminará permanentemente ${this.refType}`,
                yes: `Borrar ${this.singular}`,
                no: 'Cancelar',
                confirmed: async () => {
                    this.deleting = true
                    this.$strapi.delete(this.collection, this.content.id)
                        .then(response => {
                            this.$router.push(`/${this.collection}`)
                        })
                        .catch(err => {
                            console.error(err)
                            this.deleting = false
                        })
                }
            })
        },
        onPublishButton() {
            if (this.published) {
                this.$confirm({
                    message: ' ¿Quieres anular la publicación? ' + this.$ucFirst(`${this.refType} dejará de estar disponible para el público`),
                    yes: 'Despublicar',
                    no: 'Cancelar',
                    confirmed: () => {
                        this.unpublishContent()
                    }
                })
            } else
                this.publishContent()
        },
        publishContent() {
            this.content.publishedAt = new Date().toISOString()
            this.publishing = true
            this.submit()
            /* this.guardarcontent().then(() => {
                if (this.thereErrors)
                    this.content.publishedAt = null
            }) */
        },
        unpublishContent() {
            // let fechaPublicacion = this.content.publishedAt
            this.content.publishedAt = null
            this.publishing = true
            this.submit()
            /* this.guardarcontent().then(() => {
                console.warn('hayERrores?', this.thereErrors)
                if (this.thereErrors)
                    this.content.publishedAt = fechaPublicacion
            }) */
        },
        async onSubmit() {
            this.clearErrors()
            this.saving = true
            this.submit()
        },
        submit() {
            this.$emit('submit', { ...this.content })
        },
        clearState() {
            this.publishing = false
            this.saving = false
            this.modified = 0
        }
    }
}
</script>