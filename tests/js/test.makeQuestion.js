QUnit.module('makeQuestion', (hooks) => {
  const parentId = 'test-question';
  const questionData = {
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
  let setup;
  const setupNewQuestion = () => {
    $('<div>', { id: parentId }).appendTo('#qunit-fixture');
    const question = makeQuestion(questionData);
    const parentSelector = `#${parentId}`;
    setup = { id: parentId, parentSelector, question };
    return setup;
  };
  hooks.beforeEach(setupNewQuestion);


  test('makeQuestion is defined', assert => assert.ok(makeQuestion));

  test('question has a data property which is equal to data passed to makeQuestion', (assert) => {
    const { question } = setup;
    assert.equal(question.data, questionData, 'sets data property');
  });

  testSetParent();
  testRender();

  function testSetParent() {
    QUnit.module('question.setParent');
    test('setParent exists', assert => assert.ok(setup.question.setParent));

    test(`when selector parameter is "#${parentId}"`, (assert) => {
      const { question, parentSelector } = setup;
      question.setParent(parentSelector);
      assert.ok(question.getParent(), 'getParent does not return undefined');
      assert.ok(question.getParent() instanceof Element, 'getParent returns an Element');
    });

    test('is chainable', (assert) => {
      const { question, parentSelector } = setup;
      assert.equal(question, question.setParent(parentSelector), 'returns question instance');
    });

    test('throws if selector does not match an element in the DOM', (assert) => {
      const badSelector = '#nothing';
      const errMatcher = RegExp(`invalid parent selector: ${badSelector}`, 'ig').unicode;
      const shouldThrow = () => setup.question.setParent(badSelector);
      assert.throws(shouldThrow, errMatcher, 'throws with message');
    });
  }

  function testRender() {
    QUnit.module('question.render', (renderHooks) => {
      let question;
      let parentSelector;
      const expectedAnswers = [questionData.correct_answer, ...questionData.incorrect_answers];


      renderHooks.beforeEach(() => {
        ({ question, parentSelector } = setup);
        question.setParent(parentSelector);
      });

      test('it exists', assert => assert.ok(question.render));

      test('throws if parent is not defined', (assert) => {
        question = makeQuestion();
        assert.notOk(question.getParent(), 'when parent is not set');

        const errMatcher = /question.render called before setting parent/gi;
        assert.throws(question.render, errMatcher, 'throws with message');
      });

      test('is chainable', (assert) => {
        assert.equal(question.render(), question, 'returns question instance');
      });

      test('sets rootNode property', (assert) => {
        question.render();
        const isHTMLElement = question.getRootNode() instanceof HTMLElement;
        assert.ok(question.getRootNode(), 'getRootNode does not return undefined');
        assert.ok(isHTMLElement, 'rootNode is an instance of HTMLElement');
      });

      test('appends rootNode to parent', (assert) => {
        question.render();
        const parent = $(question.getParent());
        const parentHasRootNode = parent.children()[0] === question.getRootNode();
        assert.equal(parent.children().length, 1, 'parent has only one child');
        assert.ok(parentHasRootNode, 'rootNode is a child element of parent');
      });

      test('rootNode has one descendent with class "question"', (assert) => {
        const root = question.render().getRootNode();
        const questionNode = $(root).find('.question');
        assert.equal(questionNode.length, 1, 'there is only one descendent');
      });

      test(`when the question text is "${questionData.question}"`, (assert) => {
        question.render();
        const expected = questionData.question;
        const actual = $('.question').text();
        assert.equal(actual, expected, '.question element contains the text');
      });

      QUnit.module('answer-group', (answerGroupHooks) => {
        let answerGroup;
        const expectedClass = 'answer-group';
        const selector = `.${expectedClass}`;

        answerGroupHooks.beforeEach(() => {
          question.render();
          answerGroup = $(selector);
        });

        test(`rootNode has one descendent with class "${expectedClass}"`, (assert) => {
          assert.equal(answerGroup.length, 1, 'there is only one');
        });

        test('contains one child element with for each question', (assert) => {
          const expectedCount = expectedAnswers.length;
          const actualCount = answerGroup.children().length;
          assert.equal(actualCount, expectedCount, `should have ${expectedCount} child elements`);
        });
      });

      QUnit.module('answer', (answerHooks) => {
        const expectedClass = 'answer';
        const selector = `.${expectedClass}`;
        let answers;

        answerHooks.beforeEach(() => {
          question.render();
          answers = $(selector);
        });

        test(`each answer has "${expectedClass}" class`, (assert) => {
          assert.ok(answers.each(hasExpectedClass), 'answer.hasClass returns true');

          function hasExpectedClass(index, answer) {
            return $(answer).hasClass(expectedClass);
          }
        });

        test('each answer contains one input element', (assert) => {
          answers.each(testAnswer);
          function testAnswer(index, answer) {
            assert.equal($(answer).find('input').length, 1, 'answer.find("input") = 1');
          }
        });

        test('each input', (assert) => {
          answers.find('input')
            .toArray()
            .forEach(testInput);

          function testInput(input, index) {
            const expectedAttrs = {
              name: parentId,
              id: `${parentId}-${index}`,
              type: 'radio',
              value: expectedAnswers[index],
            };
            assert.attrIncludes(input, expectedAttrs, 'includes expected attributes');
          }
        });

        test('each answer contains one label element', (assert) => {
          answers.each(testAnswer);
          function testAnswer(index, answer) {
            assert.equal($(answer).find('label').length, 1, 'only one descendent label element');
          }
        });

        test('each label', (assert) => {
          answers.find('label')
            .toArray()
            .forEach(testLabel);

          function testLabel(label, index) {
            const expectedAttrs = { for: `${parentId}-${index}` };
            assert.attrIncludes(label, expectedAttrs, 'includes expected attributes');

            assert.equal(
              $(label).text(),
              expectedAnswers[index],
              `label text = ${expectedAnswers[index]}`,
            );
          }
        });
      });
    });
  }
});
