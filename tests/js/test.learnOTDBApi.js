const artCategory = 25;
function getArtQuestions(count = 1, type = 'any', token = 'none') {
  let url = `https://opentdb.com/api.php?amount=${count}&category=${artCategory}`;
  if (type !== 'any') {
    url += `&type=${type}`;
  }
  if (token !== 'none') {
    url += `&token=${token}`;
  }
  return $.get(url);
}

function getToken() {
  const tokenRequestUrl = 'https://opentdb.com/api_token.php?command=request';
  return $.get(tokenRequestUrl);
}

QUnit.module('Learning OTDB API');
test('request for one question from the art category works', (assert) => {
  assert.timeout(3000);
  const testComplete = assert.async();
  let result;
  getArtQuestions(1, 'any')
    .done((response) => {
      result = response;
    })
    .fail(() => {
      result = false;
    })
    .always(() => {
      assert.ok(result, `reponse: ${JSON.stringify(result, null, 4)}`);
      testComplete();
    });
});

test('the response from the api for one question from the art category', (assert) => {
  const testComplete = assert.async();
  function testResponse(response) {
    assert.ok(true, 'Response received');
    assert.equal(response.response_code, 0, 'response.response_code is 0 (success code)');
    assert.ok(Array.isArray(response.results), 'response.results is an array');
    assert.equal(response.results.length, 1, 'results contains one question');
  }

  getArtQuestions(1, 'any')
    .done(testResponse)
    .fail(() => {
      assert.ok('Response from API', 'Request failed');
    })
    .always(() => {
      testComplete();
    });
});

test('a question object', (assert) => {
  const testComplete = assert.async();
  assert.timeout(2000);
  getArtQuestions(1, 'any')
    .done(({ results }) => testArtObject(results[0]))
    .always(testComplete);

  function testArtObject(questionObject) {
    const sampleQuestion = {
      category: 'Art',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Who painted the Mona Lisa?',
      correct_answer: 'Leonardo da Vinci',
      incorrect_answers: [
        'Pablo Picasso',
        'Claude Monet',
        'Vincent van Gogh',
      ],
    };
    const expectedKeys = Object.keys(sampleQuestion);

    assert.ok(objectHasAllKeysInArray(questionObject, expectedKeys), 'has expected keys');
  }

  function objectHasAllKeysInArray(obj, keysArray) {
    return Object
      .keys(obj)
      .every(key => keysArray.indexOf(key) !== -1);
  }
});

test('a multiple choice art question', (assert) => {
  const testComplete = assert.async();
  assert.timeout(2000);

  const questionType = 'multiple';
  getArtQuestions(1, questionType)
    .done(testMultipleChoideQuestion)
    .always(testComplete);

  function testMultipleChoideQuestion(response) {
    const { results: [question] } = response;
    assert.equal(question.type, questionType, `question.type = ${questionType}`);
    assert.equal(typeof question.correct_answer, 'string', 'correct_answer property is a string');
    assert.ok(Array.isArray(question.incorrect_answers), 'incorrect_answers property is an Array');
  }
});

test('a true/false art question', (assert) => {
  assert.timeout(2000);
  const testComplete = assert.async();
  const questionType = 'boolean';
  getArtQuestions(1, questionType)
    .done(testResult)
    .always(testComplete);

  function testResult(response) {
    const { results: [question] } = response;
    const { correct_answer: answer, incorrect_answers: incorrect } = question;
    assert.equal(question.type, questionType, `question.type = ${questionType}`);
    assert.ok(isTrueOrFalseString(answer), 'answer is "True" or "False"');
    assert.ok(isTrueOrFalseString(incorrect[0]), 'first item in incorrect answers is "True" or "False');

    function isTrueOrFalseString(string) {
      return string === 'True' || string === 'False';
    }
  }
});

test('request a session token', (assert) => {
  assert.timeout(2000);
  const testComplete = assert.async();
  getToken()
    .done(testResponse)
    .always(testComplete);

  function testResponse(response) {
    const successCode = 0;
    assert.ok(response, 'response received');
    assert.equal(response.response_code, successCode, 'response_code = 0 for success');
    assert.equal(typeof response.token, 'string', 'token is a string');
    assert.ok(response.token.length > 0, 'token length > 0');
    assert.ok(response.token, `token = ${response.token}`);
  }
});

test('use token to prevent repeat questions', (assert) => {
  const timeoutSeconds = 10;
  assert.timeout(1000 * timeoutSeconds);
  const testComplete = assert.async();
  let questionSet1;
  let questionSet2;
  let sessionToken;
  getToken()
    .then(({ token }) => {
      sessionToken = token;
      return getArtQuestions(10, 'any', token);
    })
    .then(({ results }) => {
      assert.equal(results.length, 10, 'first question set has 10 questions');
      questionSet1 = results;
      return getArtQuestions(10, 'any', sessionToken);
    })
    .then(({ results }) => {
      assert.equal(results.length, 10, 'second question set has 10 questions');
      questionSet2 = results;
      return questionSet1.concat(questionSet2);
    })
    .then(questions => assert.ok(noDuplicateQuestions(questions), 'prevent duplicates with a token'))
    .always(testComplete);

  function noDuplicateQuestions(questions) {
    const counter = {};
    for (let index = 0; index < questions.length; index += 1) {
      const { question } = questions[index];
      const questionNotInCounter = !(counter[question] in counter);
      if (questionNotInCounter) {
        counter[question] = 1;
      } else {
        return false;
      }
    }
    return true;
  }
});

test('get the total number of questions in the art category', (assert) => {
  assert.timeout(4000);
  const testComplete = assert.async();

  const requestUrl = `https://opentdb.com/api_count.php?category=${artCategory}`;
  $.get(requestUrl)
    .then(testReponse)
    .always(testComplete);

  function testReponse({ category_question_count: result }) {
    assert.ok(result, 'received a response');
    const keys = [
      'total_question_count',
      'total_easy_question_count',
      'total_medium_question_count',
      'total_hard_question_count',
    ];
    keys.forEach(key => assert.ok(result[key], `${key}: ${result[key]}`));
  }
});

test('the response_code is 1 when there aren\'t enough questions', (assert) => {
  assert.timeout(2000);
  const testComplete = assert.async();
  const noResultsCode = 1;
  const difficulty = 'Easy';
  const difficultyCount = 'total_easy_question_count';
  const requestCountUrl = `https://opentdb.com/api_count.php?category=${artCategory}&difficulty=${difficulty}`;
  $.get(requestCountUrl)
    .then(response => response.category_question_count[difficultyCount])
    .then(count => requestQuestions(count + 1, difficulty))
    .then(response => assert.equal(response.response_code, noResultsCode, 'response_code is 1'))
    .always(testComplete);

  function requestQuestions(countOfQuestions, questionDifficulty) {
    const requestUrl = `https://opentdb.com/api.php?amount=${countOfQuestions}` +
      `&category=${artCategory}&difficulty=${questionDifficulty.toLowerCase()}`;
    return $.get(requestUrl);
  }
});

test('request a listing of all categories', (assert) => {
  assert.timeout(2000);
  const testComplete = assert.async();

  const requestUrl = 'https://opentdb.com/api_category.php';
  $.get(requestUrl)
    .then((response) => {
      assert.ok(response, 'response received (viewable in the console)');
      console.log('Category Listing:', response);
    })
    .always(testComplete);
});
