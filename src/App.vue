<template>
  <div ref="app" class="app">
    <Dashboard></Dashboard>
  </div>
</template>

<script>
import Dashboard from '@/components/Dashboard'
export default {
  components: {
    Dashboard,
  },
  mounted() {
    console.log(this.detectMobile())
    if (this.detectMobile()) {
      this.$refs.app.style.height = 'calc(100vh - 56px)'
    }
  },
  methods: {
    detectMobile() {
      if (
        navigator.userAgent.match(
          /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i
        )
      ) {
        return true
      }
    },
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
