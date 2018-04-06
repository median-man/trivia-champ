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

    const expectedMethods = ['optionHtml', 'headerHtml', 'getHtml', 'selectOption'];
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
  });

  QUnit.module('quiz', (hooks) => {
    const beforeEach = (assert) => {
      $('#qunit-fixture').append('<div id="quiz"></div>');
      assert.equal($('div#quiz').length, 1, 'div#quiz element in DOM');
    };
    hooks.beforeEach(beforeEach);

    const { quiz } = view;

    test('view.quiz exists', (assert) => {
      assert.ok(view.quiz, 'view.quiz is truthy');
    });

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
});
