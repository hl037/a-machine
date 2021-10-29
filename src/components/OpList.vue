<style scoped lang="scss">

</style>

<template>
  <template v-for="(i, op) in ops" :key="i">
    <AddOpWidget @addOp="(op) => addOp(i, op)">
      <n-tag type="success">
        <n-icon>
          <add></add>
        </n-icon>
      </n-tag>
    </AddOpWidget>
    <n-tag type="info" cloasable @close="removeOp(i)">{{op.repr}}</n-tag>
  </template>
  <AddOpWidget @addOp="(op) => addOp(ops.length, op)">
    <n-tag type="success">
      <n-icon>
        <add></add>
      </n-icon>
    </n-tag>
  </AddOpWidget>
</template>

<script setup lang="ts">
/* global defineProps, defineEmits */

import { ref, onMounted, watch, toRefs, computed } from 'vue'

import { Add } from '@vicons/ionicons5'

import { Operation, Transition, MConfig, Machine, getMachine, opLeft, opRight } from '@/a_machine'
import AddOpWidget from '@/components/AddOpWidget'

const props = defineProps<{
  ops: Operation[]
}>()


function removeOp(i:number) {
  props.ops.splice(i, 1)
}

function addOp(i:number, op:Operation) {
  props.ops.splice(i, 0, op)
}


</script>

