class Question {
  constructor(data) {
    this.data = data;
  }
  setParent(selector) {
    const parent = document.querySelector(selector);
    if (!parent) {
      throw new Error(`invalid parent selector: ${selector}`);
    }
    this.parent = parent;
    return this;
  }
}
