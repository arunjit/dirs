function createRoute(path) {
  return path.replace(/^\//, '').replace(/\//g, '|');
}
function createPath(route) {
  return '/' + route.replace(/\|/g, '/');
}

Polymer('dir-browser', {
  // Data
  dirs: [],
  images: [],
  currentDir: '',
  // Layout and controls
  currentPage: 0,
  hideImageControls: true,
  // Functional
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
  baseChanged: function(o, n) {
    log('baseChanged', o, '->', n);
    this.pathChanged();
  },
  pathChanged: function() {
    if (!this.base || !this.path) return;
    log('pathChanged', this.path);
    this.currentDir = this.path.substring(this.path.lastIndexOf('/') + 1) || '/';
    this.$.xhr.url = this.base + this.path;
    this.$.xhr.go();
  },
  routeChanged: function() {
    log('routeChanged', this.route);
    this._hidePreview();
    this.path = createPath(this.route);
  },
  update: function(event, http) {
    var items = http.response.map(function(item) {
      item.route = createRoute(item.path);
      return item;
    }).sort(function(a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();
      return a == b ? 0 : a < b ? -1 : 1;
    });
    this.dirs = items.filter(function(item) {
      return item.is_dir;
    });
    this.images = items.filter(function(item) {
      return item.name.match(/\.(jpe?g|png|webp|gif|bmp)$/);
    });
    log(this.dirs.length, this.images.length);
    if (!this.dirs.length) {
      this._showPreview();
    }
  },
  togglePreview: function() {
    this.currentPage == 0 ? this._showPreview() : this._hidePreview(true);
  },
  _showPreview: function() {
    log('Showing preview');
      this.$.pager.selected = this.currentPage = 1;
      this.$.imageset.images = this.images;
  },
  _hidePreview: function(goBack) {
    log('Hiding preview');
    this.$.pager.selected = this.currentPage = 0;
    this.$.imageset.images = [];
    this.hideImageControls = true;
    if (goBack && !this.dirs.length) {
      window.history.back();  // TODO: yikes. this.$.router.router.???();
    }
  },
  toggleImageControls: function(event) {
    event && event.stopPropagation();
    this.hideImageControls = !this.hideImageControls;
  },
  toggleSettings: function() {
    this.$.mainpage.togglePanel();
  }
});
