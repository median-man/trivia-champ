/* global questionData, makeQuestion */
QUnit.module('Question Data (#01)', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});

QUnit.module('question model (#01)', () => {
  const openTDBQuestions = [{
    category: 'Art',
    type: 'multiple',
    difficulty: 'medium',
    question: 'What nationality was the surrealist painter Salvador Dali?',
    correct_answer: 'Spanish',
    incorrect_answers: [
      'Italian',
      'French',
      'Portuguese',
    ],
  }, {
    category: 'Art',
    type: 'multiple',
    difficulty: 'hard',
    question: 'What year was the Mona Lisa finished?',
    correct_answer: '1504',
    incorrect_answers: [
      '1487',
      '1523',
      '1511',
    ],
  }];
  test('makeQuestion exists', (assert) => {
    assert.ok(makeQuestion);
  });
  QUnit.module('getQuestion', () => {
    test('getQuestion exists', (assert) => {
      const question = makeQuestion(openTDBQuestions[0]);
      assert.ok(question.getQuestion, 'question.getQuestion exists');
    });
    openTDBQuestions.forEach(testGetQuestion);
    function testGetQuestion(testData) {
      const questionText = testData.question;
      test(`When questionData.question is "${questionText}"`, (assert) => {
        const question = makeQuestion(testData);
        assert.equal(question.getQuestion(), questionText, `getQuestion() returns "${questionText}`);
      });
    }
  });
});
