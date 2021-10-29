
<style scoped lang="scss">

</style>

<template>
  <n-space vertical>
    <template v-for="(mc, i) in m.machine.configTable" :key="i">
      <MConfig :mc="mc" :d="m"></MConfig>
    </template>
    <n-button text @click="addMConfig">
      <n-icon>
        <add></add>
      </n-icon>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">

import { ref, onMounted, watch, toRefs, computed } from 'vue'

import { Add } from '@vicons/ionicons5'

import { MachineModel, MConfigDecl } from '@/a_machine.ts'
import MConfig from '@/components/MConfig'

const m = new MachineModel()

function addMConfig() {
  m.machine.configTable.push(new MConfigDecl().reactive())
}


</script>

