QUnit.module('Learning OTDB API');

function getArtQuestions(count = 1, type = 'any') {
  const artCategory = '25';
  let url = `https://opentdb.com/api.php?amount=${count}&category=${artCategory}`;
  if (type !== 'any') {
    url += `&type=${type}`;
  }
  return $.get(url);
}

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
