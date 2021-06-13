export default {
  state: {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    asideShow: false,
    darkMode: false,
  },

  mutations: {
    toggleSidebarDesktop(state) {
      const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow);
      state.sidebarShow = sidebarOpened ? false : 'responsive';
    },
    toggleSidebarMobile(state) {
      // console.log("Mobile store works");
      const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow);
      // console.log(sidebarClosed);
      state.sidebarShow = sidebarClosed ? true : 'responsive';
      // console.log(state.sidebarShow);
    },
    set(state, [variable, value]) {
      state[variable] = value;
    },
    toggle(state, variable) {
      state[variable] = !state[variable];
    },
  },
  actions: {
    setStateVariable({ commit }, params) {
      commit('set', params);
    },
  },

  getters: {
    getsidebarMinimize(state) {
      return state.sidebarMinimize;
    },
    getsidebarShow(state) {
      return state.sidebarShow;
    },
  },
  namespaced: true,
};
