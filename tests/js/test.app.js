/* global questionData, makeQuestion, view */

QUnit.module('view', () => {
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
      function beforeEach() {
        $('#qunit-fixture').append('<div id="quiz"></div>');
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

      test('clicking on an option calls questionCard.selectOption', (assert) => {
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

      test('clears inner html of quiz before rendering questions', (assert) => {
        assert.expect(1);
        const innerEl = $('<div id="beforeRender"></div>')[0];
        const quizEl = $('#quiz').append(innerEl)[0];

        const input = [makeQuestion(openTDBQuestions()[0])];
        quiz.render(input);

        const quizHasPreviousInnerEl = $.contains(quizEl, innerEl);
        assert.notOk(quizHasPreviousInnerEl, '#beforeRender removed from quiz.');
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

      test('it is chainable', (assert) => {
        assert.expect(1);
        const { scoreDialog } = view;
        const score = { correct: 0, incorrect: 0, unanswered: 0 };
        const actual = scoreDialog.setScore(score);
        assert.equal(actual, scoreDialog, 'returns scoreDialog');
      });

      QUnit.module('DOM Manipulation', () => {
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

    QUnit.module('show', () => {
      const { show } = view.scoreDialog;

      test('show is a function', assert => assert.isFunction(show));

      test('calls $("#score-modal").modal()', (assert) => {
        const { modal: modalStub, restoreJq: restore } = makeStubs();
        show();
        const isModalShown = modalStub.modal.calledWith({ show: true });
        assert.ok(isModalShown, 'shows Bootstrap 4 modal dialog');
        restore();

        function makeStubs() {
          const jqStub = sinon.stub(window, '$');

          const modal = sinon.stub();
          modal.modal = sinon.stub();

          jqStub.withArgs('#score-modal').returns(modal);

          const restoreJq = () => jqStub.restore();
          return { modal, restoreJq };
        }
      });

      test('is chainable', (assert) => {
        assert.expect(1);
        assert.strictEqual(view.scoreDialog.show(), view.scoreDialog, 'returns scoreDialog');
      });
    });

    QUnit.module('onHide', () => {
      const { onHide } = view.scoreDialog;
      test('it is a function', assert => assert.isFunction(onHide));

      test('sets callback function for bootsrap modal hidden event', (assert) => {
        assert.expect(1);
        const callback = sinon.stub();
        $('#qunit-fixture').append('<div id="score-modal">');
        $('#score-modal').modal({ show: true });

        onHide(callback);
        $('#score-modal').modal('hide');

        assert.ok(callback.calledOnce, 'callback was called once');
      });

      test('method is chainable', (assert) => {
        assert.expect(1);
        const stub = () => null;
        assert.strictEqual(view.scoreDialog.onHide(stub), view.scoreDialog, 'returns scoreDialog');
      });
    });
  });

  QUnit.module('timer', () => {
    const { timer } = view;
    test('view.timer exists', assert => assert.ok(timer));

    // test('selector is "#timer"', (assert) => {
    //   assert.expect(1);
    //   assert.equal(timer.selector, '#timer');
    // });

    QUnit.module('render', () => {
      test('method exists', assert => assert.ok(timer.render));

      test('sets the text for #timer element to "100"', (assert) => {
        assert.expect(1);
        timer.selector = '#timer';
        $('#qunit-fixture').append('<span id="timer">');
        timer.render(100);
        assert.equal($('#timer').text(), '100', "$('#timer').text()");
      });

      test('sets the text for #timer element to "50"', (assert) => {
        assert.expect(1);
        timer.selector = '#timer';
        $('#qunit-fixture').append('<span id="timer">');
        timer.render(50);
        assert.equal($('#timer').text(), '50', "$('#timer').text()");
      });
    });
  });
});
