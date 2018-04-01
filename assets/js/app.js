function makeQuestion(questionData) { //eslint-disable-line
  const options = shuffleArray([questionData.correct_answer, ...questionData.incorrect_answers]);

  function shuffleArray(arrToShuffle) {
    const srcCopy = arrToShuffle.slice(0);
    const result = [];
    while (srcCopy.length > 1) {
      const randomIndex = Math.floor(Math.random() * srcCopy.length);
      const [randomVal] = srcCopy.splice(randomIndex, 1);
      result.push(randomVal);
    }
    return result.concat(srcCopy);
  }
  return {
    getOptions: () => options,
    getQuestion: () => questionData.question,
    isCorrect: answer => (answer === questionData.correct_answer),
  };
}

const view = (() => {
  const selectedOptionClass = 'active';

  const questionCard = (() => {
    const optionClass = 'option';

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

    return {
      getHtml,
      headerHtml,
      optionHtml,
      selectOption,
      optionClass: () => optionClass,
    };
  })();

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

  function makeQuestionCardCollection(questions) {
    const cards = questions.map(makeCard);
    const elements = cards.map(card => card.element);

    function makeCard(question) {
      const html = questionCard.getHtml(question.getQuestion(), question.getOptions());
      const element = $(html).get(0);

      function getResult() {
        const answer = getAnswer();
        const isCorrect = question.isCorrect(answer);

        if (isCorrect) {
          return 'correct';
        } else if (answer) {
          return 'incorrect';
        }
        return 'unanswered';
      }

      function getAnswer() {
        const answerText = $(`.${selectedOptionClass}`, element).text();
        return answerText;
      }

      return {
        element,
        question,
        result: getResult,
      };
    }

    function getScores() {
      const results = cards.map(card => card.result());
      const unanswered = results.filter(result => result === 'unanswered').length;
      const correct = results.filter(result => result === 'correct').length;
      const incorrect = results.filter(result => result === 'incorrect').length;
      return { correct, incorrect, unanswered };
    }

    function renderTo(selector) {
      $(elements).appendTo(selector);
      $(elements).on('click', `.${questionCard.optionClass()}`, questionCard.selectOption);
    }

    return {
      get: () => cards,
      elements: () => elements,
      scores: getScores,
      renderTo,
    };
  }

  return { questionCard, quiz };
})();

$(() => {
  const questions = questionData.map(makeQuestion);
  view.quiz.render(questions);
  $('#quiz-done').on('click', () => {
    alert(JSON.stringify(view.quiz.getScore(), null, 2));
  });
});
