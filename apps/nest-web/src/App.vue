<script lang="ts" setup>
import TemperatureAndHumidity from './components/TemperatureAndHumidity.vue'</script>

<template>
  <TemperatureAndHumidity msg="DHT22 Data Visualization"/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>