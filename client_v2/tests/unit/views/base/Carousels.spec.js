import Vue from 'vue';
import { shallowMount, mount } from '@vue/test-utils';
import CoreuiVue from '@coreui/vue-pro';
import Carousels from '@/views/base/Carousels';

Vue.use(CoreuiVue);

describe('Carousels.vue', () => {
  it('has a name', () => {
    expect(Carousels.name).toBe('Carousels');
  });
  it('is Carousels', () => {
    const wrapper = shallowMount(Carousels);
    expect(wrapper.findComponent(Carousels)).toBeTruthy();
  });
  test('renders correctly', () => {
    const wrapper = mount(Carousels);
    expect(wrapper.element).toMatchSnapshot();
  });
});
