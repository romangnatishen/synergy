<template>
  <CHeader with-subheader>
    <CToggler in-header class="ml-3 d-lg-none" @click="toggleSidebarMobile()" />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="toggleSidebarDesktop()"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <!-- <CImg
        src="/static/axioma_black.png"
        width="100px"
        height="35px"
      /> -->

      <!-- <CIcon name="logo" height="48" alt="Logo"/> -->
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard"> Pulpit </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/userslist" exact> Użytkownicy </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>

    <CHeaderNav>
      <CHeaderNavItem class="px-3 c-d-legacy-none">
        <TheHeaderDropdownAccnt />
      </CHeaderNavItem>
    </CHeaderNav>

    <!-- <CHeaderNav>
      <CHeaderNavItem class="px-3 c-d-legacy-none">
        <button
          @click="toggleDarkMode()"
          class="c-header-nav-btn"
        >
          <CIcon v-if="darkMode" name="cil-sun"/>
          <CIcon v-else name="cil-moon"/>
        </button>
      </CHeaderNavItem>

      <TheHeaderDropdownNotif/>
      <TheHeaderDropdownTasks/>
      <TheHeaderDropdownMssgs/>
      <TheHeaderDropdownAccnt/>

      <CHeaderNavItem class="px-3">
        <button
          class="c-header-nav-btn"
          @click="toggleAsideShow()"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2"/>
        </button>
      </CHeaderNavItem>
    </CHeaderNav> -->

    <!-- <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader> -->
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt';
// import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
// import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
// import TheHeaderDropdownMssgs from './TheHeaderDropdownMssgs'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    // TheHeaderDropdownNotif,
    // TheHeaderDropdownTasks,
    // TheHeaderDropdownMssgs
  },
  methods: {
    toggleSidebarMobile() {
      // console.log("mobile works");
      return this.$store.commit('interfaceSettings/toggleSidebarMobile');
    },

    toggleDarkMode() {
      return this.$store.commit('interfaceSettings/toggle', 'darkMode');
    },
    toggleSidebarDesktop() {
      // console.log("desktop works");
      return this.$store.commit('interfaceSettings/toggleSidebarDesktop');
    },
    toggleAsideShow() {
      this.$store.commit('interfaceSettings/toggle', 'asideShow');
      return this.$store.state['interfaceSettings'].asideShow;
    },
  },

  computed: {
    darkMode() {
      return false;
      // return this.$store.getters['store/state'].darkMode;
    },
  },
};
</script>
