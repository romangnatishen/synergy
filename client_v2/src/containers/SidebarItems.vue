<script>
export default {
  name: 'nav',
  computed: {
    sidebarItems() {
      return [
        {
          _name: 'CSidebarNav',
          _children: [
            {
              _name: 'CSidebarNavDropdown',
              name: 'Redmine',
              route: '/plugins',
              icon: 'cil-input-power',
              items: [
                {
                  name: 'Projekty',
                  to: '/projectslist',
                  icon: 'cil-calendar',
                },
                {
                  name: 'Mój Kanban',
                  to: '/kanban',
                  icon: 'cil-calendar',
                },
                {
                  name: 'Kanban innych',
                  to: '/kanban_others',
                  icon: 'cil-calendar',
                },
              ],
            },
            {
              _name: 'CSidebarNavDropdown',
              name: 'Organizer',
              route: '/organizer',
              icon: 'cil-input-power',
              items: [
                {
                  name: 'Kalendarz',
                  to: '/calendar',
                  icon: 'cil-calendar',
                },
              ],
            },
          ],
        },
      ];
    },
  },
};
</script>
