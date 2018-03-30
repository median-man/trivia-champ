/* global questionData, makeQuestion */
QUnit.module('Question Data', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});

QUnit.module('question model', () => {
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

  test('has expected methods', (assert) => {
    const question = makeQuestion(openTDBQuestions[0]);
    const expectedMethods = ['getQuestion', 'getOptions'];
    expectedMethods.forEach(hasMethod);

    function hasMethod(methodName) {
      assert.ok(question[methodName], `${methodName} exists`);
      assert.equal(typeof question[methodName], 'function', `${methodName} is a function`);
    }
  });

  QUnit.module('getQuestion', () => {
    openTDBQuestions.forEach(testGetQuestion);

    function testGetQuestion(testData) {
      const questionText = testData.question;
      test(`When questionData.question is "${questionText}"`, (assert) => {
        const question = makeQuestion(testData);
        assert.equal(question.getQuestion(), questionText, `getQuestion() returns "${questionText}`);
      });
    }
  });

  QUnit.module('getOptions', () => {
    test('returns an array', (assert) => {
      const question = makeQuestion(openTDBQuestions[0]);
      assert.ok(Array.isArray(question.getOptions()));
    });

    openTDBQuestions.forEach(testOptions);
    function testOptions(testData) {
      const question = makeQuestion(testData);
      const options = question.getOptions();
      testCorrectAnswer(testData, options);
      testIncorrectAnswers(testData, options);
    }

    function testCorrectAnswer(testData, options) {
      const expected = testData.correct_answer;
      test(`When the questionData.correct_answer is ${expected}`, (assert) => {
        assert.includes(options, expected);
      });
    }

    function testIncorrectAnswers(testData, options) {
      const expected = testData.incorrect_answers;
      const expectedString = expected.join(', ');
      test(`When questionData.incorrect_answers is ${expectedString}`, (assert) => {
        assert.includes(options, expected, `returned array includes ${expectedString}`);
      });
    }
  });
});
