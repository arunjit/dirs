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
  // Data
  dirs: [],
  images: [],
  currentDir: '',
  currentImage: '',
  currentImageIndex: 0,
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
    // if (!this.dirs.length) {
    //   this.togglePreview();
    // }
  },
  togglePreview: function() {
    log(this.$.pager.selected, this.currentPage);
    this.$.pager.selected = this.currentPage = (this.currentPage + 1) % 2;
    // if (this.currentPage == 1) {
    //   // Showing preview
    //   this.currentImageIndex = 0;
    // } else {
    //   // Going back to main
    //   this.hideImageControls = true;
    // }
    log(this.$.pager.selected, this.currentPage);
  },
  toggleImageControls: function(event) {
    event && event.stopPropagation();
    this.hideImageControls = !this.hideImageControls;
  },
  currentImageIndexChanged: function() {
    if (this.images.length) {
      this.currentImage = this._getCurrentImage().path;
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
  }
});
