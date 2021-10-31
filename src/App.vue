
<style scoped lang="scss">
.sl{
  display: inline-block;
  max-width: 200px;
}

.tape{
  position: relative;
  text-align: center;
  margin: 10px;
}

.config{
  max-width: 800px;
}
</style>

<template>
  <n-message-provider>
    <n-space vertical>
      <div class="tape">
        <TapeMover :t="me.tape" :cur="me.cursorPos.value"></TapeMover><br/>
        <n-slider class="sl" :min="0" :max="me.tape.length == 0 ? 0 : me.tape.length - 1" v-model:value="me.cursorPos.value"/>
        <div>{{cur}}</div>
      </div>
      <n-space>
        <n-space class="config" vertical>
          <template v-for="(mc, i) in m.machine.configTable" :key="i">
            <MConfig :mc="mc" :d="m"></MConfig>
          </template>
          <n-button text @click="addMConfig">
            <n-icon>
              <add></add>
            </n-icon>
          </n-button>
        </n-space>
        <n-space vertical>
          <MachinePlayer :me="me"></MachinePlayer>
        </n-space>
      </n-space>
    </n-space>
  </n-message-provider>

</template>

<script setup lang="ts">

import { ref, onMounted, watch, toRefs, computed } from 'vue'

import { Add } from '@vicons/ionicons5'

import { MachineModel, MConfigDecl, MachineExecution } from '@/a_machine.ts'
import TapeMover from '@/components/TapeMover'
import MConfig from '@/components/MConfig'
import MachinePlayer from '@/components/MachinePlayer'

const cur = ref(0)

const m = new MachineModel()

const me = new MachineExecution(m)

function addMConfig() {
  m.machine.configTable.push(new MConfigDecl().reactive())
}


</script>

