<template>
  <div id="app">
    <iTunes />
  </div>
</template>

<script>
import iTunes from './components/iTunesGrid.vue'

export default {
  name: 'App',
  components: {
    iTunes
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
