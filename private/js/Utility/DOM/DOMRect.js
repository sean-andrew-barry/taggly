export class DOMRect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Read-only properties that return zero-values
  get top() {
    return 0;
  }

  get right() {
    return 0;
  }

  get bottom() {
    return 0;
  }

  get left() {
    return 0;
  }

  // Static method to create a DOMRect object from another DOMRect object or a RectInit dictionary
  static fromRect(otherRect) {
    return new DOMRect(otherRect.x, otherRect.y, otherRect.width, otherRect.height);
  }
}