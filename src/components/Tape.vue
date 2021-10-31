
<style scoped lang="scss">
.root{
  display: inline-block;
  white-space: nowrap;
}
.tape-cell{
  width:40px;
  height:40px; 
}

</style>

<template>
  <div class="root">
    <n-input
      v-for="(_, i) in t.length"
      v-model:value="t[i]"
      default-value="_"
      class="tape-cell"
      size="small"
      :key="i"
      :ref="(e) => cellRefs[i] = e"
      placeholder="-"
    />
    <!-- <n-button @click="addCell" size=small>
      <n-icon>
        <add></add>
      </n-icon>
    </n-button> -->
  </div>
  
</template>

<script setup lang="ts">
/* global defineProps, defineEmits, defineExpose */

import { ref, onMounted, watchEffect, toRefs, computed } from 'vue'

import { Add } from '@vicons/ionicons5'

import { Tape } from '@/a_machine'

const props = defineProps<{
  t: Tape,
}>()

const cellRefs = ref([])

function addCell() {
  props.t.push('')
}

defineExpose({
  getOffset(i:number){
    return cellRefs.value[i].$el.offsetLeft;
  }
})

watchEffect( () => {
  while(props.t.length < 2 || props.t[props.t.length-2] != '_' || props.t[props.t.length-1] != '_') {
    props.t.push('_')
  }
})

</script>
