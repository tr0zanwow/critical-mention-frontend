<template>
  <div class="app">
    <Dashboard></Dashboard>
  </div>
</template>

<script>
import Dashboard from '@/components/Dashboard'
export default {
  components: {
    Dashboard,
  },
}
</script>
<style lang="scss">
.app {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
