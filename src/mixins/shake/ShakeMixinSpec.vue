<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import ShakeMixin from '@/mixins/shake/Shake';

@Component
export default class ShakeMixinSpec extends Mixins(ShakeMixin) {
    isButtonShaking = false;
}
</script>

<template>
    <div>
        <button :class="shakeClass(isButtonShaking)" @click="shakeElement('isButtonShaking')">Shake</button>
    </div>
</template>
