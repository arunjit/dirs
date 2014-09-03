function createRoute(path) {
  return encodeURIComponent(path.substring(1));
}
function createPath(route) {
  return '/' + decodeURIComponent(route);
}
function log() {
  if (window.debug) {
    console.log.apply(console, arguments);
  }
}

Polymer('dir-browser', {
  dirs: [],
  images: [],
  currentDir: '',
  route: '',
  path: '',
  publish: {
    base: '',
    start: ''
  },
  ready: function() {
    log('dir-browser ready');
    this.path = this.route ? createPath(this.route) : this.start || '/';
  },
  pathChanged: function() {
    log('pathChanged', this.path);
    this.currentDir = this.path.substring(this.path.lastIndexOf('/') + 1) || '/';
    this.$.xhr.url = this.base + this.path;
    this.$.xhr.go();
  },
  routeChanged: function() {
    log('routeChanged', this.route);
    this.path = createPath(this.route);
  },
  toggleSidebar: function() {
    this.$.drawerPanel.togglePanel();
  },
  update: function(event, http) {
    var items = http.response.map(function(item) {
      item.route = createRoute(item.path);
      return item;
    });
    this.dirs = items.filter(function(item) {
      return item.is_dir;
    });
    this.images = items.filter(function(item) {
      return item.name.match(/\.(jpe?g|png|webp|gif|bmp)$/);
    });
  }
});
