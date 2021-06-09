<template>
  <CSidebar
    :minimize="minimize"
    unfoldable
    :show="show"
    @update:show="(value) => $store.commit('interfaceSettings/set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <!-- <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 642 134"
      /> -->

      <CImg
        src="/static/axioma_logo.png"
        block
        fluid
        width="120px"
        height="30px"
      />

      <CIcon
        class="c-sidebar-brand-minimized"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      />
      
    </CSidebarBrand>
    <CRenderFunction flat :contentToRender="sidebarItems"/>
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="toggleSidebarMinimize"
    />
  </CSidebar>
</template>

<script>
import SidebarItems from './SidebarItems'
export default {
  name: 'TheSidebar',
  extends: SidebarItems,
  computed: {
    show () {
      return this.$store.getters['interfaceSettings/getsidebarShow']; 
    },
    minimize () {
      return this.$store.getters['interfaceSettings/getsidebarMinimize'];
    },
  },
  
  methods:{  
    toggleSidebarMinimize () {
      this.$store.commit('interfaceSettings/toggle', 'sidebarMinimize');
      return this.$store.getters['interfaceSettings/getsidebarMinimize'];
    },
  }
}
</script>

