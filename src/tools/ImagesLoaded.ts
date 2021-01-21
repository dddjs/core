
export class ImagesLoaded {
  public loadedImages: HTMLImageElement[] = [];
  constructor(public images: string[] = []) {
    if (!(this instanceof ImagesLoaded)) {
      return new ImagesLoaded(images);
    }

    this.init()
  }

  init() {
    let tasks = this.images.length;
    var r = 
    this.images.forEach((url, ind) => {
      let image = new Image();
      image.onload = () => {
        tasks--;
        this.progress(image);
        this.check(tasks)
      }
      
      image.onerror = (e) => {
        tasks--;
        this.error(e)
        this.check(tasks)
      }
      // image.id = 'ind'
      this.loadedImages.push(image)
      image.src = url;
    
    })
  }

  check(tasks) {
    if (tasks == 0) {
      this.onAlways && this.onAlways(this.loadedImages)
    }
  }

  onProgress(callback) {
    this.progress = callback;
    return this;
  }

  onError(callback) {
    this.error = callback;
    return this;
  }

  onLoad(callback) {
    this.onAlways = callback;
    return this;
  }

  onAlways(images: HTMLImageElement[]) {

  }

  progress(image: HTMLImageElement) {

  }

  error(e) {

  }
}
