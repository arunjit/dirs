function log() {
  if (window.debug) {
    console.log.apply(console, arguments);
  }
}
function createRoute(path) {
  return path.substring(1).replace(/\//g, '|');
}
function createPath(route) {
  return '/' + route.replace(/\|/g, '/');
}
function goBack(route) {
  return route.substring(0, route.lastIndexOf('|'));
}


Polymer('dir-browser', {
  // Data
  dirs: [],
  images: [],
  currentDir: '',
  currentImage: '',
  currentImageIndex: -1,
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
      this.togglePreview();
    }
  },
  togglePreview: function() {
    if (this.currentPage == 0) {
      log('Showing preview');
      this.$.pager.selected = this.currentPage = 1;
      this.currentImageIndex = 0;  // TODO: settings (reset image index)
    } else {
      log('Hiding preview');
      this.$.pager.selected = this.currentPage = 0;
      this.hideImageControls = true;
      if (!this.dirs.length) {
        this.route = goBack(this.route);
      }
    }
  },
  toggleImageControls: function(event) {
    event && event.stopPropagation();
    this.hideImageControls = !this.hideImageControls;
  },
  currentImageIndexChanged: function() {
    log('imageIndexChanged', this.currentImageIndex);
    if (this.images.length) {
      this.currentImage = this._getCurrentImage().path;
      log('currentImage', this.currentImage);
    }
  },
  _nextImage: function() {
    return this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  },
  _previousImage: function() {
    return this.currentImageIndex = (this.currentImageIndex <= 0 ? this.images.length : this.currentImageIndex) - 1;
  },
  _getCurrentImage: function() {
    return this.images[this.currentImageIndex % this.images.length];
  },
  toggleSettings: function() {
    this.$.mainpage.togglePanel();
  },
  test: function() {
    alert('test');
  }
});
