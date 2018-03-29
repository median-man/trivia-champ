/* global questionData */
QUnit.module('#01 - Question Data', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});
