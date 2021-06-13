<template>
  <router-view></router-view>
</template>

<script>
import sequrityCheck from './plugins/sequrityCheck';

export default {
  name: 'App',
  async created() {
    sequrityCheck(this);
  },
};
</script>

<style lang="scss">
// Import Main styles for this application
@import 'assets/scss/style';
</style>
