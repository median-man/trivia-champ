class Question {
  constructor(data) {
    this.data = data;
  }

  render() {
    if (!this.parent) {
      throw new Error('question.render called before setting parent');
    }
    const root = $('<div>');
    root.text(this.data.question);
    this.setRootNode(root[0]);
    return this;
  }

  setRootNode(element) {
    this.rootNode = element;
    $(this.parent).append(this.rootNode);
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
