
<style scoped lang="scss">

.root{
  display: inline-block;
  position: relative;
  text-align: left;
  max-width: 100%;
  height: 60px;
  .area{
    position: relative;
    margin-top: 3px;
    display: inline-block;
    .tape{
      display: inline-block;
      overflow: auto;
      white-space: nowrap;
    }
    .cursor{
      position: absolute;
      pointer-events: none;
      transition: left .3s ease-out;
      left: 0px;
      top: 0px;
      .frame{
        border: 2px solid blue;
        position: absolute;
        width: 40px;
        height: 40px;
        top: -2px;
        left: -2px;
        
        .triangle{
          color: red;
          text-align: center;
          font-size: 23px;
          position: absolute;
          width: 100%;
          bottom: -20px;
        }
      }
    }
  }
}
</style>

<template>
  <n-scrollbar class="root" x-scrollable>
    <div class="area">
      <TapeComponent :t="t" ref="tapeRef" class="tape"></TapeComponent>
      <div class="cursor" :style="cursorPos">
        <div class="frame">
          <div class="triangle">
            <n-icon>
              <triangle></triangle>
            </n-icon>
          </div>
        </div>
      </div>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
/* global defineProps, defineEmits */

import { ref, onMounted, watchEffect, toRefs, computed } from 'vue'

import { Triangle } from '@vicons/ionicons5'

import { Tape } from '@/a_machine'
import TapeComponent from '@/components/Tape'

const props = defineProps<{
  t: Tape,
  cur: number,
}>()

const tapeRef = ref(null)

const cursorPos = computed( () => {
  if(tapeRef.value === null) {
    return {
      top: '0px',
      left: '0px',
    }
  }
  return {
    top: '0px',
    left: tapeRef.value.getOffset(props.cur) + 'px'
  }
})


</script>

