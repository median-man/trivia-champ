/* global questionData, makeQuestion, view */
const openTDBQuestions = [
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

QUnit.module('Question Data', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});

QUnit.module('question model', () => {
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

QUnit.module('view', () => {
  test('view exists', assert => assert.ok(view));

  QUnit.module('questionCard', () => {
    const { questionCard } = view;
    test('view.questionCard exists', (assert) => {
      assert.ok(questionCard, 'is defined');
    });

    const expectedMethods = ['optionHtml', 'headerHtml', 'getHtml'];
    expectedMethods.forEach(hasMethodTest);

    function hasMethodTest(methodName) {
      test(`questionCard has ${methodName} method`, (assert) => {
        assert.isFunction(questionCard[methodName]);
      });
    }

    QUnit.module('optionHtml', () => {
      const { optionHtml } = questionCard;
      test('takes a string and returns a button string', (assert) => {
        const tests = [{
          input: 'Frodo Baggins',
          expected: '<button type="button" class="list-group-item list-group-item-action">'
            + 'Frodo Baggins</button>',
        }, {
          input: 'Gandalf the Grey',
          expected: '<button type="button" class="list-group-item list-group-item-action">'
            + 'Gandalf the Grey</button>',
        },
        ];
        tests.forEach(testOptionHtml);

        function testOptionHtml({ input, expected }) {
          assert.equal(optionHtml(input), expected, `when text is ${input}`);
        }
      });
    });

    QUnit.module('headerHtml', () => {
      const { headerHtml } = questionCard;
      test('takes string and returns a card header string', (assert) => {
        const tests = [{
          input: 'Glamdring',
          expected: '<div class="card-header text-white"><h5>Glamdring</h5></div>',
        }, {
          input: 'Orcrist',
          expected: '<div class="card-header text-white"><h5>Orcrist</h5></div>',
        }];
        tests.forEach(testHeaderHtml);

        function testHeaderHtml({ input, expected }) {
          assert.equal(headerHtml(input), expected, `when input is ${input}`);
        }
      });
    });

    QUnit.module('getHtml', () => {
      const { getHtml } = questionCard;
      test('accepts a question string and an array of option strings and returns card string', (assert) => {
        const tests = [
          {
            input: {
              questionText: '',
              options: [''],
            },
            expected: '<div class="card mb-3">'
            + '<div class="card-header text-white"><h5></h5></div>'
            + '<div class="list-group list-group-flush">'
            + '<button type="button" class="list-group-item list-group-item-action"></button>'
            + '</div>'
            + '</div>',
          },
          {
            input: {
              questionText: 'What is the name of the watchtower on Tol Sirion?',
              options: [''],
            },
            expected: '<div class="card mb-3">'
            + '<div class="card-header text-white"><h5>What is the name of the watchtower on Tol Sirion?</h5></div>'
            + '<div class="list-group list-group-flush">'
            + '<button type="button" class="list-group-item list-group-item-action"></button>'
            + '</div>'
            + '</div>',
          },
          {
            input: {
              questionText: 'What is the name of the watchtower on Tol Sirion?',
              options: ['Minas Tirith'],
            },
            expected: '<div class="card mb-3">'
            + '<div class="card-header text-white"><h5>What is the name of the watchtower on Tol Sirion?</h5></div>'
            + '<div class="list-group list-group-flush">'
            + '<button type="button" class="list-group-item list-group-item-action">Minas Tirith</button>'
            + '</div>'
            + '</div>',
          },
          {
            input: {
              questionText: 'What is the name of the watchtower on Tol Sirion?',
              options: ['Angband', 'Minas Tirith'],
            },
            expected: '<div class="card mb-3">'
            + '<div class="card-header text-white"><h5>What is the name of the watchtower on Tol Sirion?</h5></div>'
            + '<div class="list-group list-group-flush">'
            + '<button type="button" class="list-group-item list-group-item-action">Angband</button>'
            + '<button type="button" class="list-group-item list-group-item-action">Minas Tirith</button>'
            + '</div>'
            + '</div>',
          },
        ];
        tests.forEach(testGetHtml);

        function testGetHtml({ input, expected }) {
          const inputStr = JSON.stringify(input, null, 6);
          assert.equal(getHtml(input.questionText, input.options), expected, `input: ${inputStr}`);
        }
      });
    });
  });

  QUnit.module('quiz', (hooks) => {
    const beforeEach = (assert) => {
      $('#qunit-fixture').append('<div id="quiz"></div>');
      assert.equal($('div#quiz').length, 1, 'div#quiz element in DOM');
    };
    hooks.beforeEach(beforeEach);

    const { quiz } = view;
    Object.assign(hooks, { beforeEach });

    test('view.quiz exists', (assert) => {
      assert.ok(view.quiz, 'view.quiz is truthy');
    });

    test('has render method', assert => assert.isFunction(quiz.render));

    test('no question cards are rendered when empty question array is passed in', (assert) => {
      quiz.render([]);
      assert.equal($('#quiz').html(), '', '#quiz is empty');
    });

    test('renders html for one questionCard when there is one question passed in', (assert) => {
      const input = [makeQuestion(openTDBQuestions[0])];

      const expectedHtml = '<div id="gandalf">Gandalf the Grey</div>';
      const stub = sinon.stub(view.questionCard, 'getHtml');
      stub.returns(expectedHtml);

      quiz.render(input);
      const quizNode = document.querySelector('#quiz');
      const gandalf = document.querySelector('div#gandalf');
      const domContainsExpected = $.contains(quizNode, gandalf);
      assert.ok(domContainsExpected, '#quiz contains div#gandalf');

      stub.restore();
    });

    test('renders html for each question passed in', (assert) => {
      const input = [makeQuestion(openTDBQuestions[0]), makeQuestion(openTDBQuestions[1])];
      const expectedHtml = input.map(question => [question.getQuestion(), question.getOptions()])
        .map(params => view.questionCard.getHtml(...params));

      quiz.render(input);
      const actualHtml = $('#quiz').html();
      const hasExpectedHtml = expectedHtml.every(html => actualHtml.includes(html));
      assert.ok(hasExpectedHtml, '#quiz has expected html');
    });
  });
});
