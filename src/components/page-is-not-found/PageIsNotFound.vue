<template>
    <div>
        <h2>Page is not found</h2>
        <button type="button" @click="goToMain">Go to main</button>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {NotesAppRouteName} from '@/router/route-name';

@Component
export default class PageIsNotFound extends Vue {
    goToMain(): void {
        this.$router.push({
            name: NotesAppRouteName.MAIN,
        })
    }
}
</script>
