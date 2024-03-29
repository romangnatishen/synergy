import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import CoreuiVue from '@coreui/vue-pro';
import ListGroups from '@/views/base/ListGroups';

Vue.use(CoreuiVue);

describe('ListGroups.vue', () => {
  it('has a name', () => {
    expect(ListGroups.name).toBe('ListGroups');
  });
  it('is Vue instance', () => {
    const wrapper = shallowMount(ListGroups);
    expect(wrapper.vm).toBeTruthy();
  });
  it('is ListGroups', () => {
    const wrapper = shallowMount(ListGroups);
    expect(wrapper.findComponent(ListGroups)).toBeTruthy();
  });
  test('renders correctly', () => {
    const wrapper = shallowMount(ListGroups);
    expect(wrapper.element).toMatchSnapshot();
  });
});
