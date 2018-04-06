const view = (() => {
  const quiz = (() => {
    let questionCardCollection;
    return {
      getScore: () => questionCardCollection.scores(),
      render: (questions) => {
        questionCardCollection = makeQuestionCardCollection(questions);
        questionCardCollection.renderTo('#quiz');
      },
    };
  })();

  const questionCardView = (() => {
    const optionClass = 'option';
    const selectedOptionClass = 'active';

    function getHtml(questionText, options) {
      const header = headerHtml(questionText);
      const optionsHtml = options.map(optionHtml).join('');
      const listGroup = `<div class="list-group list-group-flush">${optionsHtml}</div>`;
      return `<div class="card mb-3">${header + listGroup}</div>`;
    }

    function headerHtml(text) {
      return `<div class="card-header text-white"><h5>${text}</h5></div>`;
    }

    function optionHtml(text) {
      const classes = `list-group-item list-group-item-action ${optionClass}`;
      return `<button type="button" class="${classes}">${text}</button>`;
    }

    function selectOption(event) {
      $(event.target)
        .addClass(selectedOptionClass)
        .siblings().removeClass(selectedOptionClass);
    }

    function getSelectedOption(cardElement) {
      return $(`.${selectedOptionClass}`, cardElement).text();
    }

    return {
      getHtml,
      headerHtml,
      optionHtml,
      selectOption,
      getSelectedOption,
      optionClass: () => optionClass,
    };
  })();

  function makeQuestionCardCollection(questions) {
    const cards = questions.map(question => new QuestionCard(question));
    const elements = cards.map(card => card.element);

    function getScores() {
      const results = cards.map(card => card.result);
      const unanswered = results.filter(result => result === 'unanswered').length;
      const correct = results.filter(result => result === 'correct').length;
      const incorrect = results.filter(result => result === 'incorrect').length;
      return { correct, incorrect, unanswered };
    }

    function renderTo(selector) {
      const { optionClass, selectOption } = questionCardView;
      $(elements).appendTo(selector);
      $(elements).on('click', `.${optionClass()}`, selectOption);
    }

    return {
      scores: getScores,
      renderTo,
    };
  }

  class QuestionCard {
    constructor(question) {
      const html = questionCardView.getHtml(question.getQuestion(), question.getOptions());
      const element = $(html).get(0);
      this.element = element;
      this.question = question;
    }

    get result() {
      const answer = questionCardView.getSelectedOption(this.element);
      const isCorrect = this.question.isCorrect(answer);

      if (isCorrect) {
        return 'correct';
      } else if (answer) {
        return 'incorrect';
      }
      return 'unanswered';
    }
  }

  const scoreDialog = (() => {
    const result = {};

    function setScore(score) {
      throwOnMissingValue(score);
      $('#score-correct').text(score.correct);
      $('#score-incorrect').text(score.incorrect);
      $('#score-unanswered').text(score.unanswered);
      return result;
    }

    function throwOnMissingValue(score) {
      const requiredKeys = ['correct', 'incorrect', 'unanswered'];
      const missingKeys = requiredKeys.filter(key => !(key in score));
      const isScoreMissingKey = missingKeys.length > 0;
      if (isScoreMissingKey) throw new Error('invalid score');
    }

    function show() {
      $('#score-modal').modal({ show: true });
    }

    Object.assign(result, { setScore, show });

    return result;
  })();

  return { questionCard: questionCardView, quiz, scoreDialog };
})();
