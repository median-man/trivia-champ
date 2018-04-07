QUnit.module('Question Data', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});
/*
QUnit.module('question model', (hooks) => {
  let randomStub;
  const openTDBQuestions = () => [
    {
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
    },
    {
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
    },
  ];
  hooks.before(() => {
    const preventOptionShuffle = 0;
    randomStub = sinon.stub(Math, 'random').returns(preventOptionShuffle);
  });
  hooks.afterEach(() => {
    randomStub.resetBehavior();
  });
  hooks.after(() => {
    randomStub.restore();
  });
  test('makeQuestion exists', (assert) => {
    assert.ok(makeQuestion);
  });

  test('makeQuestions shuffles the order of the options', (assert) => {
    const testData = openTDBQuestions()[0];
    testData.correct_answer = 1;
    testData.incorrect_answers = [2, 3, 4];

    testShuffle([1, 2, 3, 4], [0, 0, 0]);
    testShuffle([2, 1, 3, 4], [0.25, 0, 0]);
    testShuffle([3, 1, 2, 4], [0.5, 0, 0]);
    testShuffle([1, 3, 2, 4], [0, 0.34, 0]);
    testShuffle([3, 2, 4, 1], [0.5, 0.34, 0.5]);

    function testShuffle(expected, randoms) {
      setupStub(randoms);
      const actual = makeQuestion(testData).getOptions();
      assert.deepEqual(actual, expected, `when Math.random() returns ${randoms.join(', ')}`);
    }

    function setupStub(nums) {
      randomStub.reset();
      nums.forEach((num, index) => randomStub.onCall(index).returns(num));
    }
  });

  test('has expected methods', (assert) => {
    const question = makeQuestion(openTDBQuestions()[0]);
    const expectedMethods = ['getQuestion', 'getOptions'];
    expectedMethods.forEach(hasMethod);

    function hasMethod(methodName) {
      assert.ok(question[methodName], `${methodName} exists`);
      assert.equal(typeof question[methodName], 'function', `${methodName} is a function`);
    }
  });

  QUnit.module('getQuestion', () => {
    openTDBQuestions().forEach(testGetQuestion);

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
      const question = makeQuestion(openTDBQuestions()[0]);
      assert.ok(Array.isArray(question.getOptions()));
    });

    openTDBQuestions().forEach(testOptions);

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
 */
QUnit.module('question model', (hooks) => {
  let randomStub;
  const openTDBQuestions = () => [
    {
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
    },
    {
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
    },
  ];
  hooks.before(() => {
    const preventOptionShuffle = 0;
    randomStub = sinon.stub(Math, 'random').returns(preventOptionShuffle);
  });
  hooks.afterEach(() => {
    randomStub.resetBehavior();
  });
  hooks.after(() => {
    randomStub.restore();
  });
  test('makeQuestion exists', (assert) => {
    assert.ok(makeQuestion);
  });

  test('makeQuestions shuffles the order of the options', (assert) => {
    const testData = openTDBQuestions()[0];
    testData.correct_answer = 1;
    testData.incorrect_answers = [2, 3, 4];

    testShuffle([1, 2, 3, 4], [0, 0, 0]);
    testShuffle([2, 1, 3, 4], [0.25, 0, 0]);
    testShuffle([3, 1, 2, 4], [0.5, 0, 0]);
    testShuffle([1, 3, 2, 4], [0, 0.34, 0]);
    testShuffle([3, 2, 4, 1], [0.5, 0.34, 0.5]);

    function testShuffle(expected, randoms) {
      setupStub(randoms);
      const actual = makeQuestion(testData).getOptions();
      assert.deepEqual(actual, expected, `when Math.random() returns ${randoms.join(', ')}`);
    }

    function setupStub(nums) {
      randomStub.reset();
      nums.forEach((num, index) => randomStub.onCall(index).returns(num));
    }
  });

  test('has expected methods', (assert) => {
    const question = makeQuestion(openTDBQuestions()[0]);
    const expectedMethods = ['getQuestion', 'getOptions', 'isCorrect'];
    expectedMethods.forEach(hasMethod);

    function hasMethod(methodName) {
      assert.ok(question[methodName], `${methodName} exists`);
      assert.equal(typeof question[methodName], 'function', `${methodName} is a function`);
    }
  });

  QUnit.module('getQuestion', () => {
    openTDBQuestions().forEach(testGetQuestion);

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
      const question = makeQuestion(openTDBQuestions()[0]);
      assert.ok(Array.isArray(question.getOptions()));
    });

    openTDBQuestions().forEach(testOptions);

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

  QUnit.module('isCorrect', () => {
    const testData = openTDBQuestions()[0];
    const question = makeQuestion(testData);

    test('accepts a string and returns true if it is the correct answer', (assert) => {
      const correct = testData.correct_answer;
      assert.strictEqual(question.isCorrect(correct), true, 'true when answer is incorrect');
    });

    test('accepts a string and returns false if it is not the correct answer', (assert) => {
      const incorrect = testData.incorrect_answers[0];
      assert.strictEqual(question.isCorrect(incorrect), false, 'false when answer is incorrect');
    });
  });
});
