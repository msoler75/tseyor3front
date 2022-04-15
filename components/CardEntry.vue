<template>
    <Card class="flex-row">
        <NLink :style="imageBg(data.imagen.url)" class="w-40 h-32 flex-shrink-0 mr-4"
            :to="curl" />
        <div class="space-y-1 flex-grow">
            <NLink :to="curl"
                class="font-serif leading-tight sm:text-base md:text-lg lg:text-xl font-bold">{{ data.titulo }}
            </NLink>
            <div class="text-xs" v-if="ccategory">
                <icon icon="circle" class="text-sello-fuerte transform scale-75" />
                <NLink
                    class="font-bold font-sans tracking-widest text-diminished opacity-80 hover:opacity-100 uppercase"
                    :to="ccategory.url">{{ ccategory.label }}</NLink>
            </div>
            <v-clamp autoresize :max-lines="3" class="text-base text-diminished">{{ cdescription }}</v-clamp>
        </div>
    </Card>
</template>

<script>
import VClamp from 'vue-clamp'
export default {
    components: { VClamp },
    props: {
        data: {},
        collection: {type: String, required: true},
        categoryFunction: {
            type: Function,
            required: false,
            default: null
        }
    },
    computed: {
        ccategory() {
            if (this.categoryFunction)
                return this.categoryFunction(this.data)
            return null
        },
        cid () {
            return this.data.slug || this.data.id
        },
        curl() {
            return `/${this.collection}/${this.cid}`
        },
        cdescription () {
            return this.data.description || this.data.descripcion || this.data.texto || this.data.text
        }
    },
    methods: {
        imageBg(image) {
            console.log('imageBg', image)
            const imgUrl = this.$img(image, {
                width: 200,
                format: 'webp',
                quality: 70
            })
            return {
                backgroundImage: `url('${imgUrl}')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }
        }
    }
}
</script>
