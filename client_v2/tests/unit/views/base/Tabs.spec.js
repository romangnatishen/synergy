import Vue from 'vue';
import { mount, shallowMount } from '@vue/test-utils';
import CoreuiVue from '@coreui/vue-pro';
import Tabs from '@/views/base/Tabs';

Vue.use(CoreuiVue);

describe('Tabs.vue', () => {
  it('has a name', () => {
    expect(Tabs.name).toBe('Tabs');
  });
  it('has a created hook', () => {
    expect(typeof Tabs.data).toMatch('function');
  });
  it('sets the correct default data', () => {
    expect(typeof Tabs.data).toMatch('function');
  });
  it('is Vue instance', () => {
    const wrapper = mount(Tabs);
    expect(wrapper.vm).toBeTruthy();
  });
  it('is Tabs', () => {
    const wrapper = mount(Tabs);
    expect(wrapper.findComponent(Tabs)).toBeTruthy();
  });
  test('renders correctly', () => {
    const wrapper = shallowMount(Tabs);
    expect(wrapper.element).toMatchSnapshot();
  });
});
