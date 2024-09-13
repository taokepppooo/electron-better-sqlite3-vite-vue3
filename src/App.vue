<script setup lang="ts">
import { ipcRenderer } from 'electron'

const handleClick = () => {
  console.log('click')
  // ipcRenderer.send('connect-client')
  ipcRenderer.send('scan-network')
}
</script>

<template>
  2222
  <button @click="handleClick">click</button>
</template>

<style scoped>

</style>
