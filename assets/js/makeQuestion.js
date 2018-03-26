function makeQuestion(data) {
  let rootNode;
  let parent;

  function render() {
    if (!parent) {
      throw new Error('question.render called before setting parent');
    }
    const root = $('<div>').append(renderQuestionEl(data.question), answerGroup());
    setRootNode(root[0]);
    return this;
  }

  function renderQuestionEl(text) {
    const questionAttr = {
      text,
      class: 'question',
    };
    return $('<div>', questionAttr);
  }

  function answerGroup() {
    return $('<div>')
      .addClass('answer-group')
      .append(renderAllAnswers());
  }

  function renderAllAnswers() {
    const answerData = [data.correct_answer, ...data.incorrect_answers];
    return answerData.map(renderAnswer);
  }

  function renderAnswer(text, index) {
    const answerClass = 'answer';
    const root = $('<span>', { class: answerClass });
    const id = `${parent.id}-${index}`;

    const inputAttr = {
      name: parent.id,
      id,
      type: 'radio',
      value: text,
    };
    const input = $('<input>', inputAttr);

    const labelAttr = { for: id, text };
    const label = $('<label>', labelAttr);

    return root.append(input, label);
  }

  function setRootNode(element) {
    rootNode = element;
    $(parent).append(rootNode);
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
