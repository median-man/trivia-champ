QUnit.module('Learning OTDB API');
function getOneArtQuestion() {
  const artCategory = '25';
  const questionCount = 1;
  const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${artCategory}`;
  return $.get(url);
}

test('request for one question from the art category works', (assert) => {
  assert.timeout(3000);
  const testComplete = assert.async();
  const artCategory = '25';
  const questionCount = 1;
  const url = `https://opentdb.com/api.php?amount=${questionCount}&category=${artCategory}`;
  let result;
  $.get(url)
    .done((response) => {
      result = response;
    })
    .fail(() => {
      result = false;
    })
    .always(() => {
      assert.ok(result);
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
  getOneArtQuestion()
    .done(testResponse)
    .fail(() => {
      assert.ok('Response from API', 'Request failed');
    })
    .always(() => {
      testComplete();
    });
});
QUnit.todo('a question object', (assert) => {
  
});
