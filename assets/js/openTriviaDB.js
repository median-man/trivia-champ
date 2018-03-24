const openTriviaDB = (() => {
  function requestQuestions(count) {
    const artCategory = '25';
    const url = `https://opentdb.com/api.php?amount=${count}&category=${artCategory}`
    return $.get(url).then(response => response.results);
  }

  function getQuestions(count) {
    return Promise.resolve(requestQuestions(count));
  }

  return {
    getQuestions,
  };
})();
