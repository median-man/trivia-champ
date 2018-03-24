/* global openTriviaDB sinon */
QUnit.module('openTriviaDB', () => {
  const apiQuestion = {
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

  const fakeXhr = {
    setup() {
      this.xhr = sinon.useFakeXMLHttpRequest();
      this.requests = [];
      this.xhr.onCreate = (req) => {
        this.requests.push(req);
      };
      return this;
    },

    restore() {
      this.xhr.restore();
      return this;
    },

    respond(requestIndex, questions, responseCode = '0') {
      const success = 200;
      const header = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      };
      const body = JSON.stringify({
        response_code: responseCode,
        results: questions,
      });
      this.requests[requestIndex].respond(success, header, body);
      return this;
    },
  };

  test('openTriviaDB', (assert) => {
    assert.ok(openTriviaDB, 'it exists');
  });

  const moduleHooks = {
    beforeEach() {
      fakeXhr.setup();
    },
    afterEach() {
      fakeXhr.restore();
    },
  };

  QUnit.module('getQuestions(count)', moduleHooks, () => {
    const { getQuestions } = openTriviaDB;
    test('when count = 1', (assert) => {
      const testDone = assert.async();
      assert.ok(getQuestions, 'it exists');

      const getQuestionsResult = getQuestions(1);
      fakeXhr.respond(0, [apiQuestion]);

      assert.ok(getQuestionsResult instanceof Promise, 'it returns a promise');

      getQuestionsResult
        .then(((questions) => {
          assert.ok(Array.isArray(questions), 'yields an array');
          assert.equal(questions.length, 1, 'yields 1 question');

          const [question] = questions;
          assert.ok(typeof question === 'object', 'question is an object');
          assert.deepEqual(Object.keys(question), Object.keys(apiQuestion), 'question has expected keys');
        }))
        .finally(testDone);
    });

    test('when count = 2', (assert) => {
      const testDone = assert.async();
      getQuestions(2)
        .then((questions) => {
          assert.equal(questions.length, 2, 'returns 2 questions');
        })
        .finally(testDone);
      fakeXhr.respond(0, [apiQuestion, apiQuestion]);
    });

    test('yields an empty array when there aren\'t enough questions', (assert) => {
      const testDone = assert.async();
      const noResultsResponseCode = '1';
      getQuestions(2)
        .then((questions) => {
          assert.equal(questions.length, 0, 'yields empty array');
        })
        .finally(testDone);
      fakeXhr.respond(0, [], noResultsResponseCode);
    });
  });
});
