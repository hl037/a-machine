
<style scoped lang="scss">

</style>

<template>
  <n-card>
    <n-space vertical="">
      <n-button-group>
        <n-button round @click="stepBackward">
          <template #icon>
            <n-icon>
              <PlaySkipBack/>
            </n-icon>
          </template>
        </n-button>
        <n-button @click="togglePlayBack">
          <template #icon>
            <n-icon>
              <Pause v-if="playingBack"/>
              <PlayBack v-else/>
            </n-icon>
          </template>
        </n-button>
        <n-button round @click="reset">
          <template #icon>
            <n-icon>
              <Refresh/>
            </n-icon>
          </template>
        </n-button>
        <n-button @click="togglePlay">
          <template #icon>
            <n-icon>
              <Pause v-if="playing"/>
              <Play v-else/>
            </n-icon>
          </template>
        </n-button>
        <n-button round @click="stepForward">
          <template #icon>
            <n-icon>
              <PlaySkipForward/>
            </n-icon>
          </template>
        </n-button>
      </n-button-group>
      <div>
        Speed <n-slider :min=".1" :max="5." :step=".1" v-model:value="delay"></n-slider>
      </div>
      <div v-if='state != null'>
        State <n-tag>{{state.mconfig}}</n-tag><br/>
        Symbol <n-tag>{{state.symbol}}</n-tag><br/>
        Operations : <template v-for="(op, i) in state.operations" :key="i">
          <n-tag :type="i == me.history.currentOp ? 'info' : 'default'">{{op.repr}}</n-tag>
        </template>
      </div>
    </n-space>
  </n-card>
  
</template>

<script setup lang="ts">
/* global defineProps, defineEmits, defineExpose */

import { ref, onMounted, watch, toRefs, computed, nextTick } from 'vue'

import { Play, PlayBack, Pause, Refresh, PlaySkipForward, PlaySkipBack } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

import { MachineExecution } from '@/a_machine'

const props = defineProps<{
  me: MachineExecution
}>()

const state = computed( () => props.me.currentState() )

const message = useMessage()

const playing = ref(false)
let playIntervalId:any = null


const playingBack = ref(false)
let playBackIntervalId:any = null

const delay = ref(1.)

function showErrors(cb:()=>void){
  try{
    cb()
  }
  catch(e){
    if(e instanceof String) {
      message.error(e)
    }
    else {
      throw e
    }
  }
}

function stepForward() {
  showErrors( () => props.me.stepForward() )
}
function stepBackward() {
  showErrors( () => props.me.stepBackward() )
}

function togglePlay() {
  if(playingBack.value) {
    clearInterval(playBackIntervalId)
    playingBack.value = false
  }
  if(playing.value) {
    clearInterval(playIntervalId)
    playing.value = false
  }
  else {
    playIntervalId = setInterval(() => {
      nextTick( () => {
        stepForward()
      })
    }, delay.value * 1000)
    playing.value = true
  }
}

function togglePlayBack() {
  if(playing.value) {
    clearInterval(playIntervalId)
    playing.value = false
  }
  if(playingBack.value) {
    clearInterval(playIntervalId)
    playingBack.value = false
  }
  else {
    playBackIntervalId = setInterval(() => {
      nextTick( () => {
        stepBackward()
      })
    }, delay.value * 1000)
    playingBack.value = true
  }
}

function reset(){
  props.me.recompile(true)
}

watch( delay, (nv) => {
  if(playing.value) {
    togglePlay()
    togglePlay()
  }
})

</script>

