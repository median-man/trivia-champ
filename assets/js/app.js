const view = (() => {
  const questionCard = {
    getHtml: (questionText, options) => {
      const header = questionCard.headerHtml(questionText);
      const optionsHtml = options.map(questionCard.optionHtml).join('');
      const listGroup = `<div class="list-group list-group-flush">${optionsHtml}</div>`;
      return `<div class="card mb-3">${header + listGroup}</div>`;
    },

    headerHtml: text => `<div class="card-header text-white"><h5>${text}</h5></div>`,

    optionHtml: (text) => {
      const classes = `list-group-item list-group-item-action ${questionCard.optionClass()}`;
      return `<button type="button" class="${classes}">${text}</button>`;
    },

    optionClass: () => 'option',

    selectOption: (event) => {
      const activeClass = 'active';
      $(event.target)
        .addClass(activeClass)
        .siblings().removeClass(activeClass);
    },
  };

  const quiz = {
    render: (questions) => {
      const rootNode = $('#quiz');
      const questionCards = questions.map(getQuestionCardHtml).join('');
      rootNode.append(questionCards);
      initOptionClickEvents();
    },
  };
  function getQuestionCardHtml(question) {
    return questionCard.getHtml(question.getQuestion(), question.getOptions());
  }
  function initOptionClickEvents() {
    $(`.${questionCard.optionClass()}`).click(questionCard.selectOption);
  }

  return { questionCard, quiz };
})();
