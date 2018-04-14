QUnit.module('QuizTimer', (hooks) => {
  let quizTimer;
  hooks.beforeEach(() => {
    quizTimer = new QuizTimer();
  });
  test('it exists', (assert) => {
    assert.ok(quizTimer);
  });
  QUnit.module('secondsRemaining', () => {
    test('it exists', assert => assert.ok(quizTimer.secondsRemaining));
    test('it is initially set to 120', (assert) => {
      assert.expect(1);
      assert.equal(quizTimer.secondsRemaining, 120);
    });
  });

  QUnit.module('onChange', () => {
    test('it is initially set to null', (assert) => {
      assert.expect(1);
      assert.strictEqual(quizTimer.onChange, null, 'quizTimer.onChange');
    });
  });

  QUnit.module('onTimeUp', () => {
    test('is initially set to null', (assert) => {
      assert.expect(1);
      assert.strictEqual(quizTimer.onTimeUp, null, 'quizTimer.onTimeUp = null');
    });
  });

  QUnit.module('tick', () => {
    test('decrements secondsRemaining', (assert) => {
      assert.expect(1);
      const before = quizTimer.secondsRemaining;
      quizTimer.tick();
      const after = quizTimer.secondsRemaining;
      assert.equal(after, before - 1, 'secondsRemaining after tick');
    });

    test('calls onChange if it is not null', (assert) => {
      assert.expect(1);
      const stub = sinon.stub();
      quizTimer.onChange = stub;
      quizTimer.tick();
      assert.ok(stub.calledOnce, 'onChange called once');
    });

    test('passes secondsRemaining to onChange', (assert) => {
      assert.expect(1);
      const stub = sinon.stub();
      quizTimer.onChange = stub;
      quizTimer.tick();
      const expected = quizTimer.secondsRemaining;
      assert.ok(stub.firstCall.calledWith(expected), 'onChange called with secondsRemaining');
    });

    QUnit.module('when time runs out', (timeOutHooks) => {
      timeOutHooks.beforeEach(() => {
        quizTimer.secondsRemaining = 1;
      });

      test('calls onTimeUp', (assert) => {
        assert.expect(1);
        const stub = sinon.stub();
        quizTimer.onTimeUp = stub;
        quizTimer.tick();
        assert.ok(stub.calledOnce, 'called onTimeUp once');
      });

      test('does not throw if onTimeUp is null', (assert) => {
        assert.expect(1);
        quizTimer.onTimeUp = null;
        quizTimer.tick();
        assert.ok(true, 'quizTimer.tick() did not throw');
      });

      test('calls clearInterval with intervalId', (assert) => {
        assert.expect(2);
        const spy = sinon.spy(window, 'clearInterval');
        quizTimer.intervalId = 1;
        quizTimer.tick();
        assert.ok(spy.calledOnce, 'called clearInterval');
        assert.ok(spy.firstCall.calledWith(quizTimer.intervalId), 'called with intervalId');
        spy.restore();
      });
    });
  });

  QUnit.module('start', (moduleHooks) => {
    let setIntervalSpy;

    moduleHooks.beforeEach(() => {
      setIntervalSpy = sinon.spy(window, 'setInterval');
    });

    moduleHooks.afterEach(() => {
      window.clearInterval(setIntervalSpy.firstCall.returnValue);
      setIntervalSpy.restore();
    });

    test('calls setInterval', (assert) => {
      assert.expect(1);
      quizTimer.start();
      assert.ok(setIntervalSpy.calledOnce, 'window.setInterval called once');
    });

    test('interval is 1 second', (assert) => {
      assert.expect(1);
      quizTimer.start();
      const actualIntervalArgument = setIntervalSpy.firstCall.args[1];
      assert.equal(actualIntervalArgument, 1000, 'ms passed to setInterval');
    });

    test('passes function which calls tick to setInterval', (assert) => {
      assert.expect(1);
      quizTimer.start();
      const shouldCallTick = setIntervalSpy.firstCall.args[0];
      const tickSpy = sinon.spy(quizTimer, 'tick');
      shouldCallTick();
      assert.ok(tickSpy.calledOnce, 'tick called');
      tickSpy.restore();
    });

    test('sets intervalId to id returned by setInterval', (assert) => {
      assert.expect(1);
      quizTimer.start();
      assert.equal(quizTimer.intervalId, setIntervalSpy.firstCall.returnValue, 'intervalId');
    });
  });

  QUnit.module('functional tests', () => {
    test('the onChange callback is invoked each second after starting the timer', (assert) => {
      const clock = setup();

      assert.expect(3);

      quizTimer.start();
      clock.tick(1000);
      assert.ok(quizTimer.onChange.calledOnce, 'onChange called once');

      clock.tick(1000);
      assert.ok(quizTimer.onChange.calledTwice);

      clock.tick(6000);
      assert.equal(quizTimer.onChange.callCount, 8);

      teardown();

      function setup() {
        quizTimer.onChange = sinon.stub();
        return sinon.useFakeTimers();
      }

      function teardown() {
        clock.restore();
        window.clearInterval(quizTimer.intervalId);
      }
    });
    test('the onTimeUp callback is invoked 120 seconds after called start', (assert) => {
      const clock = setup();

      assert.expect(1);
      quizTimer.start();
      const msToTimeUp = 120 * 1000;
      clock.tick(msToTimeUp);
      assert.ok(quizTimer.onTimeUp.calledOnce);

      teardown();

      function setup() {
        quizTimer.onTimeUp = sinon.stub();
        return sinon.useFakeTimers();
      }

      function teardown() {
        clock.restore();
      }
    });
  });
});
