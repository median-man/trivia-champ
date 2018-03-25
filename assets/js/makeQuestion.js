function makeQuestion(data) {
  let rootNode;
  let parent;

  function setRootNode(element) {
    rootNode = element;
    $(parent).append(rootNode);
  }

  function render() {
    if (!parent) {
      throw new Error('question.render called before setting parent');
    }
    const root = $('<div>');
    root.text(data.question);
    setRootNode(root[0]);
    return this;
  }

  function setParent(selector) {
    parent = document.querySelector(selector);
    if (!parent) {
      throw new Error(`invalid parent selector: ${selector}`);
    }
    return this;
  }

  return {
    data,
    render,
    getParent: () => parent,
    setParent,
    getRootNode: () => rootNode,
  };
}
