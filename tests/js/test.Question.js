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
  test('Question is defined', assert => assert.ok(Question));

  test('has a data property which is equal to data passed to constructor', (assert) => {
    const question = new Question(questionData);
    assert.equal(question.data, questionData, 'sets data property');
  });

  testSetParent();
  testRender();

  function testSetParent() {
    let question;
    const id = 'question-1';
    const setParentHooks = {
      beforeEach() {
        $('<div>', { id }).appendTo('#qunit-fixture');
        question = new Question(questionData);
      },
    };
    QUnit.module('question.setParent', setParentHooks);
    test('setParent exists', assert => assert.ok(question.setParent));

    test('when selector is "#question-1"', (assert) => {
      question.setParent(`#${id}`);
      assert.ok(question.parent, 'question.parent exists');
      assert.ok(question.parent instanceof Element, 'question.parent is an Element');
    });

    test('returns the question', (assert) => {
      assert.equal(question, question.setParent(`#${id}`));
    });

    test('throws if selector does not match an element in the DOM', (assert) => {
      const badSelector = '#nothing';
      const errMatcher = RegExp(`invalid parent selector: ${badSelector}`, 'ig').unicode;
      assert.throws(() => question.setParent('#nothing'), errMatcher, 'throws with message');
    });
  }

  function testRender() {
    QUnit.module.todo('question.render');
    QUnit.todo('it exists', () => {});
    QUnit.todo('throws if parent is not defined', () => {});
    QUnit.todo('returns question', () => {});
    QUnit.todo('sets rootNode property', () => {});
    QUnit.todo('append rootNode to parent', () => {});
    QUnit.todo('renders html at rootNode', () => {});
  }
});
