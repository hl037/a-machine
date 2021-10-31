
<style scoped lang="scss">

</style>

<template>

  <n-card :id="mc.name">
    <template #header>
      <n-input v-model:value="mc.name" placeholder="State name"></n-input>
    </template>
    <n-table size="small">
      <thead>
        <tr>
          <th>Tape symbol</th>
          <th>Final state</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{t, fs} in transitions" :key="t">
          <td>
            <n-dynamic-tags v-model:value="t.syms" placeholder="Tape symbol"></n-dynamic-tags>
          </td>
          <td>
            <n-select v-model:value="fs.value" filterable tag :options="d._mconfig_options.value"></n-select>
          </td>
          <td>
            <OpList :ops="t.operations"></OpList>
          </td>
        </tr>
        <tr>
          <td>
            <n-button text @click="addTransition">
              <n-icon>
                <add></add>
              </n-icon>
            </n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
  
</template>

<script lang="ts">
import { ref, reactive, onMounted, watch, toRefs, computed } from 'vue'

import { Add } from '@vicons/ionicons5'

import { Sym, MConfigDecl, MachineModel, TransitionDecl } from '@/a_machine';

export function mconfig2option(mc:MConfigDecl) {
  return {
    label: mc.name,
    value: mc.name,
  }
}

</script>

<script setup lang="ts">
/* global defineProps, defineEmits */
  
import OpList from '@/components/OpList'


const emit = defineEmits<{
  (e: 'newState', name: string): void,
}>()

const props = defineProps<{
  mc: MConfigDecl,
  d: MachineModel
}>()
let _options = props.d._mconfig_options

if(_options === undefined) {
  _options = ((d: MachineModel) => {
    return computed( () => {
      return d.machine.configTable.map(mconfig2option)
    })
  })(props.d) // This is to make the computed scope independent from the current component and remove reactivity (it's a cache)
  props.d._mconfig_options = _options
}

const transitions = computed(
  () => {
    return props.mc.transitions.map( e => {
      return {
        t: e,
        fs : computed({
          get(){
            return e.finalState === null ? '': e.finalState.name
          },
          set(nv){
            e.finalState = props.d.getMConfig(nv)
          }
        })
      }
    })
  }
)

function addTransition() {
  props.mc.transitions.push(new TransitionDecl())
}

</script>

