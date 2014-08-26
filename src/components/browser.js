Polymer('dir-browser', {
  items: [],
  publish: {
    baseUrl: '',
    path: ''
  },
  currentUrl: function() {
    return this.baseUrl + this.path;
  },
  currentDir: function() {
    return this.path.substring(this.path.lastIndexOf('/') + 1) || '/';
  },
  toggleSidebar: function() {
    this.$.drawerPanel.togglePanel();
  },
  update: function() {
    console.log('Update');
  }
});
