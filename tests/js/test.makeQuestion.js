QUnit.module('makeQuestion', () => {
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

  const setupNewQuestion = (id) => {
    $('<div>', { id }).appendTo('#qunit-fixture');
    const question = makeQuestion(questionData);
    const parentSelector = `#${id}`;
    return { parentId: id, parentSelector, question };
  };

  test('makeQuestion is defined', assert => assert.ok(makeQuestion));

  test('question has a data property which is equal to data passed to makeQuestion', (assert) => {
    const { question } = setupNewQuestion();
    assert.equal(question.data, questionData, 'sets data property');
  });

  testSetParent();
  testRender();

  function testSetParent() {
    let setup;
    const id = 'question-1';
    const setParentHooks = {
      beforeEach() {
        setup = setupNewQuestion(id);
      },
    };
    QUnit.module('question.setParent', setParentHooks);
    test('setParent exists', assert => assert.ok(setup.question.setParent));

    test(`when selector parameter is "#${id}"`, (assert) => {
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
    let question;
    let parentSelector;
    const hooks = {
      beforeEach() {
        ({ question, parentSelector } = setupNewQuestion('test-question'));
        question.setParent(parentSelector);
      },
    };
    QUnit.module('question.render', hooks);
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

    test('renders html at rootNode', (assert) => {
      question.render();
      const questionText = questionData.question;
      const html = $(question.getRootNode()).html();
      assert.includes(html, questionText, 'html includes question text');
    });
  }
});
