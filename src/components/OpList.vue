<style scoped lang="scss">

.root{
  min-width: 300px;
  .edit{
    display: none;
  }
  .readonly{
    display: inline-block;
  }
  &:hover{
    .edit{
      display: inline-block;
    }
    .readonly{
      display: none;
    }
  }
}

</style>

<template>
  <div class="root">
    <div class="edit">
      <template v-for="(op, i) in ops" :key="i">
        <AddOpWidget @addOp="(op) => addOp(i, op)">
          <n-tag type="success">
            <n-icon>
              <add></add>
            </n-icon>
          </n-tag>
        </AddOpWidget>
        <n-tag type="info" closable @close="removeOp(i)">{{op.repr}}</n-tag>
      </template>
      <AddOpWidget @addOp="(op) => addOp(ops.length, op)">
        <n-tag type="success">
          <n-icon>
            <add></add>
          </n-icon>
        </n-tag>
      </AddOpWidget>
    </div>
    <div class="readonly">
      <template v-for="(op, i) in ops" :key="i">
        <n-tag type="info">{{op.repr}}</n-tag>
      </template>
    </div>
  </div>
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

