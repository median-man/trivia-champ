QUnit.module('Question', () => {
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
    const question = new Question(questionData);
    const parentSelector = `#${id}`;
    return { parentId: id, parentSelector, question };
  };

  test('Question is defined', assert => assert.ok(Question));

  test('has a data property which is equal to data passed to constructor', (assert) => {
    const question = new Question(questionData);
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
      assert.ok(question.parent, 'question.parent exists');
      assert.ok(question.parent instanceof Element, 'question.parent is an Element');
    });

    test('returns the question', (assert) => {
      const { question, parentSelector } = setup;
      assert.equal(question, question.setParent(parentSelector));
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
      question.parent = undefined;
      assert.notOk(question.parent, 'when parent is not set');

      const errMatcher = /question.render called before setting parent/gi;
      assert.throws(question.render, errMatcher, 'throws with message');
    });

    test('is chainable', (assert) => {
      assert.equal(question.render(), question, 'returns question instance');
    });

    test('sets rootNode property', (assert) => {
      question.render();
      assert.ok(question.rootNode, 'rootNode property exists');
      assert.ok(question.rootNode instanceof HTMLElement, 'rootNode is an instance of HTMLElement');
    });

    test('append rootNode to parent', (assert) => {
      question.render();
      const parentHasRootNode = $(question.parent).children()[0] === question.rootNode;
      assert.equal($(question.parent).children().length, 1, 'parent has only one child');
      assert.ok(parentHasRootNode, 'rootNode is a child element of parent');
    });

    test('renders html at rootNode', (assert) => {
      const questionText = questionData.question;
      question.render();
      const html = $(question.rootNode).html();
      assert.includes(html, question.data.question, 'html includes question text');
    });
  }
});
