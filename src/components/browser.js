Polymer('dir-browser' {
  items: [],
  toggleSidebar: function() {
    this.$.sidebar.toggleDrawer();
  },
  update: function() {
    console.log('Update');
  }
});
