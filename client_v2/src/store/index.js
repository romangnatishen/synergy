import Vue from 'vue'
import Vuex from 'vuex'
import projects from './projects';
import calendar from './calendar';
import issues from './issues';
import profile from './profile';

import interfaceSettings from './interfaceSettings';

Vue.use(Vuex)

const modules = {
    projects,
    issues,
    calendar,
    profile,
    interfaceSettings,
  }

export default new Vuex.Store({
  modules,
  namespaced: true
})