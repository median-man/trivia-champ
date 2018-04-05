/* global questionData, makeQuestion, view */
const { todo, only } = QUnit;
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

QUnit.module('Question Data', () => {
  test('questionData is an array', (assert) => {
    assert.ok(Array.isArray(questionData), 'Array.isArray(questionData)');
  });
  test('questionData has 10 items', (assert) => {
    assert.equal(questionData.length, 10, 'questionData.length = 10');
  });
});

QUnit.module('question model', (hooks) => {
  let randomStub;
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

QUnit.module('view', () => {
  test('view exists', assert => assert.ok(view));

  QUnit.module('questionCard', () => {
    const { questionCard } = view;
    test('view.questionCard exists', (assert) => {
      assert.ok(questionCard, 'is defined');
    });

    const expectedMethods = [
      'optionHtml',
      'headerHtml',
      'getHtml',
      'getSelectedOption',
      'optionClass',
    ];
    expectedMethods.forEach(testForMethod);
    function testForMethod(methodName) {
      test(`questionCard has ${methodName} method`, (assert) => {
        assert.isFunction(questionCard[methodName]);
      });
    }

    QUnit.module('optionHtml', () => {
      const { optionHtml } = questionCard;
      test('takes a string and returns a button string', (assert) => {
        const tests = [{
          input: 'Frodo Baggins',
          expected: '<button type="button" class="list-group-item list-group-item-action option">'
            + 'Frodo Baggins</button>',
        }, {
          input: 'Gandalf the Grey',
          expected: '<button type="button" class="list-group-item list-group-item-action option">'
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
              + '<button type="button" class="list-group-item list-group-item-action option"></button>'
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
              + '<button type="button" class="list-group-item list-group-item-action option"></button>'
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
              + '<button type="button" class="list-group-item list-group-item-action option">Minas Tirith</button>'
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
              + '<button type="button" class="list-group-item list-group-item-action option">Angband</button>'
              + '<button type="button" class="list-group-item list-group-item-action option">Minas Tirith</button>'
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

    QUnit.module('selectOption', (hooks) => {
      const { selectOption } = questionCard;
      const activeClass = 'active';
      let testFixture;

      hooks.beforeEach((assert) => {
        testFixture = makeTestFixture();
        assert.notOk(
          testFixture.options.hasClass(activeClass),
          `options should not have "${activeClass}" class`,
        );
      });
      function makeTestFixture() {
        const optionClass = 'option';
        $('#qunit-fixture')
          .append(`<div class="${optionClass}">Gil-galad</div>`)
          .append(`<div class="${optionClass}">Isildur</div>`);

        const options = $(`.${optionClass}`);
        options.click(selectOption);

        return { options };
      }

      test(`accepts a DOM click event object and adds the "${activeClass}" class to it`, (assert) => {
        const option = testFixture.options.first();
        option.click();
        assert.ok(option.hasClass(activeClass), 'option has "active" class after click event');
      });

      test(`accepts a DOM click event object and removes "${activeClass}" class from other options in set`, (assert) => {
        const firstOpt = testFixture.options.eq(0);
        const secondOpt = testFixture.options.eq(1);
        firstOpt.addClass(activeClass);
        secondOpt.click();
        assert.notOk(firstOpt.hasClass('active'), 'option has "active" class after click event');
      });
    });

    QUnit.module('getSelectedOption', () => {
      const { getSelectedOption } = questionCard;

      function setupQuestionElement(options) {
        const html = `
          <div>
            <div>Who is known as the White Wizard?</div>
            <div>${options.join('')}</div>
          </div>`;
        const element = $(html).appendTo('#qunit-fixture')[0];
        return element;
      }

      test('when no option is selected for the question', (assert) => {
        const options = [
          '<div>Isuldur</div>',
          '<div>Saruman</div>',
          '<div>Gandalf</div>',
          '<div>Turin</div>',
        ];
        const questionElement = setupQuestionElement(options);
        const expected = '';
        const result = getSelectedOption(questionElement);
        assert.equal(result, expected, 'returns ""');
      });

      test('when an option is selected for the test', (assert) => {
        const options = [
          '<div>Isuldur</div>',
          '<div class="active">Saruman</div>',
          '<div>Gandalf</div>',
          '<div>Turin</div>',
        ];
        const questionElement = setupQuestionElement(options);
        const expected = 'Saruman';
        const result = getSelectedOption(questionElement);
        assert.equal(result, expected, 'returns "Saruman"');
      });
    });

    QUnit.module('optionClass', () => {
      test('returns class name included in the class list of every option element', (assert) => {
        const expected = 'option';
        const result = questionCard.optionClass();
        assert.equal(expected, result, `returns "${expected}"`);
      });
    });
  });

  QUnit.module('quiz', () => {
    const { quiz } = view;

    test('view.quiz exists', (assert) => {
      assert.ok(view.quiz, 'view.quiz is truthy');
    });

    QUnit.module('render', (hooks) => {
      hooks.beforeEach(beforeEach);
      function beforeEach(assert) {
        $('#qunit-fixture').append('<div id="quiz"></div>');
        assert.equal($('div#quiz').length, 1, 'div#quiz element in DOM');
      }
      test('has render method', assert => assert.isFunction(quiz.render));

      test('no question cards are rendered when empty question array is passed in', (assert) => {
        quiz.render([]);
        assert.equal($('#quiz').html(), '', '#quiz is empty');
      });

      test('renders html for one questionCard when there is one question passed in', (assert) => {
        const input = [makeQuestion(openTDBQuestions()[0])];

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

      test('uses questionCard.getHtml to render html for each question passed in', (assert) => {
        const input = [makeQuestion(openTDBQuestions()[0]), makeQuestion(openTDBQuestions()[1])];
        quiz.render(input);
        const actualHtml = $('#quiz').html();
        const expectedHtml = getExpectedHtml(input);
        assert.includes(actualHtml, expectedHtml, '#quiz has expected html');

        function getExpectedHtml(questions) {
          return questions
            .map(question => [question.getQuestion(), question.getOptions()])
            .map(([questionText, options]) => view.questionCard.getHtml(questionText, options));
        }
      });

      test('click on an option calls questionCard.selectOption', (assert) => {
        const selectOptionStub = sinon.stub(view.questionCard, 'selectOption');
        setup(selectOptionStub);
        $('#qunit-fixture button').first().click();
        assert.ok(selectOptionStub.calledOnce, 'selectOption was called once');
        selectOptionStub.restore();

        function setup(stub) {
          const input = [makeQuestion(openTDBQuestions()[0])];
          quiz.render(input);
          assert.notOk(stub.called, 'selectOption should not have been called before test');
        }
      });
    });

    QUnit.module('getScore', (hooks) => {
      let questions;
      const { getScore } = view.quiz;

      hooks.beforeEach(renderQuiz);

      function renderQuiz() {
        $('#qunit-fixture').append('<div id="quiz">');
        questions = openTDBQuestions().map(makeQuestion);
        view.quiz.render(questions);
      }

      test('has getScore method', assert => assert.isFunction(quiz.getScore));

      test('returns object with correct, incorrect, and unanswered keys', (assert) => {
        const expectedKeys = ['correct', 'incorrect', 'unanswered'];
        const result = getScore();
        assert.notEqual(result, undefined, 'result of getScore() is defined');
        expectedKeys.forEach(key => objHasKey(result, key));

        function objHasKey(obj, key) {
          assert.ok(key in obj, `"${key}" in object`);
        }
      });

      test('when there are 2 questions and none are answered', (assert) => {
        assert.equal($('.card').length, 2, 'two questions are rendered before test');
        const { unanswered } = getScore();
        assert.equal(unanswered, 2, 'score.unanswered is 2');
      });

      function setupSelectedOption(answerText, assert) {
        const option = $(`button:contains(${answerText})`).click();
        assert.equal(option.text(), answerText, `select "${answerText}" before test`);
        assert.equal($('.card').length, 2, 'two questions are rendered before test');
        assert.equal($('.active').length, 1, 'there is only one asnwer selected before the test');
        return option;
      }

      test('when there are 2 questions and one is answered correctly', (assert) => {
        const correctAnswer = openTDBQuestions()[0].correct_answer;
        setupSelectedOption(correctAnswer, assert);

        const score = getScore();
        assert.equal(score.unanswered, 1, 'getScore().unanswered is 1');
        assert.equal(score.correct, 1, 'getScore().correct is 1');
      });

      test('when there are 2 questions and one is answered incorrectly', (assert) => {
        const incorrectAnswer = openTDBQuestions()[0].incorrect_answers[0];
        setupSelectedOption(incorrectAnswer, assert);

        const score = getScore();
        assert.equal(score.correct, 0, 'getScore().correct is 0');
        assert.equal(score.incorrect, 1, 'getScore().incorrect is 1');
      });
    });
  });

  QUnit.module('scoreDialog', () => {
    test('scoreDialog exists', (assert) => {
      assert.ok(view.scoreDialog, 'it exists');
    });

    QUnit.module('setScore', () => {
      const { setScore } = view.scoreDialog;

      test('setScore is a function', assert => assert.isFunction(setScore));

      test('it does not throw when score has expected keys', (assert) => {
        assert.expect(1);
        const validScore = { correct: 0, incorrect: 0, unanswered: 0 };
        let isNoErrorThrown = true;
        try {
          setScore(validScore);
        } catch (err) {
          isNoErrorThrown = false;
        }
        assert.ok(isNoErrorThrown, 'did not throw');
      });

      test('it throws when score is missing an expected key', (assert) => {
        assert.expect(3);
        assertThrowsIfMissingKey('correct');
        assertThrowsIfMissingKey('incorrect');
        assertThrowsIfMissingKey('unanswered');

        function assertThrowsIfMissingKey(missingKey) {
          const score = { correct: 0, incorrect: 0, unanswered: 0 };
          delete score[missingKey];
          const expectedError = Error('invalid score');
          const msg = `missing '${missingKey}' key`;
          assert.throws(() => setScore(score), expectedError, msg);
        }
      });

      test('it sets the text of the score elements when score is { correct: 0, incorrect: 0, '
        + 'unanswered: 0 }', (assert) => {
        setUpFixture();

        setScore({ correct: 0, incorrect: 0, unanswered: 0 });

        const elementText = getElementText();
        assert.equal(elementText.correct, '0', 'set #score-correct');
        assert.equal(elementText.incorrect, '0', 'set #score-incorrect');
        assert.equal(elementText.unanswered, '0', 'set #score-unanswered');
      });

      test('it sets the text of the score elements when score is { correct: 1, incorrect: 4, '
        + 'unanswered: 2 }', (assert) => {
        setUpFixture();

        setScore({ correct: 1, incorrect: 4, unanswered: 2 });

        const elementText = getElementText();
        assert.equal(elementText.correct, '1', 'set #score-correct');
        assert.equal(elementText.incorrect, '4', 'set #score-incorrect');
        assert.equal(elementText.unanswered, '2', 'set #score-unanswered');
      });

      function setUpFixture() {
        const scoreIds = ['score-correct', 'score-incorrect', 'score-unanswered'];
        const scoreElements = scoreIds.map(id => `<span id="${id}"></span>`);
        $('#qunit-fixture').append(scoreElements);
      }

      function getElementText() {
        return {
          correct: $('#score-correct').text(),
          incorrect: $('#score-incorrect').text(),
          unanswered: $('#score-unanswered').text(),
        };
      }
    });
  });
});
