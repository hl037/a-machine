
<style scoped lang="scss">

</style>

<template>
  <n-popover trigger="click" :ref="(e) => popover = e">
    <template #trigger><slot></slot></template>
      
    <n-tag type="info" @click="emitMove(opLeft)">{{opLeft.repr}}</n-tag>
    <n-tag type="info" @click="emitMove(opRight)">{{opRight.repr}}</n-tag>
    <n-tag type="info">P( <n-input v-model:value="sym" size="small" autosize @keyup.enter="emitPrint()"></n-input>)</n-tag>
  </n-popover>
</template>

<script setup lang="ts">
/* global defineProps, defineEmits */

import { ref, onMounted, watch, toRefs, computed } from 'vue'

import { Sym, Operation, opLeft, opRight, opPrint} from '@/a_machine'

const emit = defineEmits<{
  (e: 'addOp', op: Operation): void,
}>()

const sym=ref<Sym>('')

const popover = ref(null);

function emitMove(op){
  emit('addOp', op)
  popover.value.setShow(false);
}

function emitPrint() {
  emit('addOp', opPrint(sym.value))
  sym.value = ''
  popover.value.setShow(false);
}

</script>

