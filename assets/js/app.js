function makeQuestion(questionData) { //eslint-disable-line
  const options = [questionData.correct_answer, ...questionData.incorrect_answers];
  return {
    getOptions: () => options,
    getQuestion: () => questionData.question,
  };
}

const view = (() => {
  const questionCard = {
    getHtml: (questionText, options) => {
      const header = questionCard.headerHtml(questionText);
      const optionsHtml = options.map(questionCard.optionHtml).join('');
      const listGroup = `<div class="list-group list-group-flush">${optionsHtml}</div>`;
      return `<div class="card mb-3">${header + listGroup}</div>`;
    },

    headerHtml: text => `<div class="card-header text-white"><h5>${text}</h5></div>`,

    optionHtml: text =>
      `<button type="button" class="list-group-item list-group-item-action">${text}</button>`,
  };

  function renderQuiz(questions) {
    const rootNode = $('#quiz');
    const questionHtml = questions
      .map(question => questionCard.getHtml(question.getQuestion(), question.getOptions()))
      .join('');
    rootNode.append(questionHtml);
  }
  const quiz = { render: renderQuiz };

  return { questionCard, quiz };
})();

$(() => {
  const questions = questionData.map(makeQuestion);
  view.quiz.render(questions);
});
