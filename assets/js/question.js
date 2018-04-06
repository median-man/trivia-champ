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