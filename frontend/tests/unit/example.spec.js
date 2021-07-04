import { shallowMount } from '@vue/test-utils'
import iTunesGrid from '@/components/iTunesGrid.vue'

describe('iTunesGrid.vue', () => {
  it('renders error message', () => {
    const wrapper = shallowMount(iTunesGrid, {
      data() {
        return {
          albums: [],
          filteredAlbums: [],
          filterText: '',
          errorMsg: 'A error message'
        }
      }
    });

    expect(wrapper.find( '.filter').exists()).toBe(false);
    expect(wrapper.find('.loadError').exists()).toBe(true);
    expect(wrapper.find('.loadError').text()).toBe('Error loading albums: A error message');

  });

  it('does not render error message', () => {
    const wrapper = shallowMount(iTunesGrid, {
      data() {
        return {
          albums: [],
          filteredAlbums: [],
          filterText: '',
          errorMsg: ''
        }
      }
    });

    expect(wrapper.find( '.filter').exists()).toBe(true);
    expect(wrapper.find('.loadError').exists()).toBe(false);
  });

  xit('shows three albums', () => {
    const wrapper = shallowMount(iTunesGrid, {
      data() {
        return {
          albums: [],
          filteredAlbums: [
            {
              name: "Miley Cyrus",
              album: "Whatever",
              thumbnail: "testURL"
            },
            {
              name: "Miley Cyrus",
              album: "Whatever Two",
              thumbnail: "testURL"
            },
            {
              name: "Miley Cyrus",
              album: "Whatever",
              thumbnail: "testURL"
            }
          ],
          filterText: '',
          errorMsg: ''
        }
      }
    });

    expect(wrapper.findAll( 'div.row').length).toBe(4);
  });

});
