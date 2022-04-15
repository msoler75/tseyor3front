<template>
    <div class="relative">
        <div
            class="flex w-8 justify-center items-center absolute right-3 top-3 py-1 cursor-pointer"
            @click="viewing = !viewing"
        >
            <icon :icon="viewing ? 'eye-slash' : 'eye'" />
        </div>
        <input
            id="password"
            v-model="localValue"
            :type="viewing ? 'text' : 'password'"
            placeholder="Contraseña"
            required
        />
    </div>
</template>

<script>
import vmodel from '@/mixins/vmodel'
export default {
    mixins: [vmodel],
    data() {
        return {
            viewing: false
        }
    }
}
</script>