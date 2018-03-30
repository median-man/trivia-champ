function makeQuestion(questionData) { //eslint-disable-line
  const options = [questionData.correct_answer, ...questionData.incorrect_answers];
  return {
    getOptions: () => options,
    getQuestion: () => questionData.question,
  };
}
