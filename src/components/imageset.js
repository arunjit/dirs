Polymer('dir-imageset', {
  currentImage: '',
  currentImageIndex: -1,
  images: [],
  base: '',
  imagesChanged: function() {
    if (!this.base) return;
    log('imageset: loading new images', this.images);
    this.currentImageIndex = this.images.length ? 0 : -1;
  },
  currentImageIndexChanged: function() {
    if (!this.base) return;
    log('currentImageIndexChanged', this.currentImageIndex);
    if (this.currentImageIndex >= 0 && this.images.length) {
      this.currentImage = this.base + this._getCurrentImage().path;
    } else {
      this.currentImage = '';
    }
    log('currentImage', this.currentImage);
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
  trackstart: function(event) {
    event.stopPropagation();
    event.preventTap();
  },
  trackend: function(event) {
    event.stopPropagation();
    event.preventTap();

    if (event.dx < -20) {
      this._nextImage();
    } else if (event.dx > 20) {
      this._previousImage();
    }
  }
});
