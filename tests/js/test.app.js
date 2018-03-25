/* global timer, sinon */
QUnit.module('timer', () => {
  const timerId = 'timer';
  const appendTimerElement = () => $('<div>', { id: timerId }).appendTo('#qunit-fixture');
  const selector = `#${timerId}`;
  const seconds = 5;

  test('it exists', (assert) => {
    assert.ok(timer, 'is defined');
  });
  testInit();
  testTick();
  testShow();
  testHide();
  testRender();
  testStart();

  function testInit() {
    QUnit.module('init', { }, () => {
      test('is a function', (assert) => {
        assert.isFunction(timer.init);
      });

      test('throws when the rootElementSelector does not match an element on the page', (assert) => {
        const expectedErrMessage = `timer.init: invalid rootElementSelector: '${selector}'`;
        const errorMatcher = RegExp(expectedErrMessage, 'g').unicode;
        assert.throws(() => timer.init('#badSelector', seconds), errorMatcher, 'throws an error');
      });

      test('returns reference to timer', (assert) => {
        appendTimerElement();
        assert.equal(timer.init(selector, seconds), timer, 'returns timer');
      });

      test('sets the rootElement property', (assert) => {
        appendTimerElement();
        timer.init(selector, seconds);
        assert.equal(
          timer.rootElement,
          document.getElementById(timerId),
          'root element for timer is defined',
        );
      });

      test('set initial time', (assert) => {
        appendTimerElement();
        [1, 2, seconds].forEach(runTest);

        function runTest(testSeconds) {
          timer.init(selector, testSeconds);
          assert.equal(
            timer.initialTime,
            testSeconds,
            `initial time is ${testSeconds} when seconds paremter is ${testSeconds}`,
          );
        }
      });

      const onTimeOutStub = () => {};
      test('timer.onTimeOut is set when settings.onTimeOut is defined', (assert) => {
        appendTimerElement();
        timer.init(selector, seconds, { onTimeOut: onTimeOutStub });
        assert.ok(timer.onTimeOut, 'timer.onTimeOut exists');
        assert.equal(timer.onTimeOut, onTimeOutStub, 'timer.onTimeOut = settings.onTimeOut');
      });
    });
  }

  function testRender() {
    QUnit.module('render', () => {
      test('render method exists', assert => assert.ok(timer.render, 'timer.render is defined'));
      test('returns timer', (assert) => {
        assert.equal(timer.render(), timer);
      });
      testTimeRemaining(30);
      testTimeRemaining(20);

      function testTimeRemaining(remainingTime) {
        test(`when timer.timeRemaining = ${remainingTime}`, (assert) => {
          appendTimerElement();
          timer.init(selector, seconds);
          timer.timeRemaining = remainingTime;
          timer.render();
          const expectedText = `Timer: ${remainingTime}`;
          const actualText = $(selector).text();
          assert.equal(actualText, expectedText, `sets text to "${expectedText}"`);
        });
      }
    });
  }

  function testTick() {
    let onTimeOutSpy;
    let renderSpy;
    const tickModuleHooks = {
      beforeEach() {
        appendTimerElement();
        timer.init(selector, seconds, { onTimeOut: () => {} });
        onTimeOutSpy = sinon.spy(timer, 'onTimeOut');
        renderSpy = sinon.spy(timer, 'render');
      },
      afterEach() {
        onTimeOutSpy.restore();
        renderSpy.restore();
      },
    };
    QUnit.module('tick', tickModuleHooks, () => {
      test('tick method exists', assert => assert.ok(timer.tick, 'is defined'));

      test('when timer.timeRemaining is 1', (assert) => {
        timer.timeRemaining = 1;
        timer.tick();
        assert.equal(timer.timeRemaining, 0, 'it decrements timeRemaining by 1');
        assert.notOk(onTimeOutSpy.calledOnce, 'onTimeOut is not called');
        assert.ok(renderSpy.calledOnce, 'render is called once');
      });

      test('when timer.timeRemaining is 0', (assert) => {
        timer.tick();
        timer.timeRemaining = 0;
        assert.equal(timer.timeRemaining, 0, 'timeRemaining is unchanged');
        assert.ok(onTimeOutSpy.called, 'onTimeOut is called once');
        assert.notOk(renderSpy.called, 'render is not called');
      });
    });
  }

  function testShow() {
    QUnit.module('show', () => {
      test('show method exists', assert => assert.ok(timer.show, 'timer.show is defined'));
      test('returns reference to timer', (assert) => {
        assert.equal(timer.show(), timer);
      });
      test('removes "hidden" class from rootElement', (assert) => {
        appendTimerElement();
        timer.init(selector, seconds);
        $(selector).addClass('hidden');
        timer.show();
        assert.notOk($(selector).hasClass('hidden'), 'root element does not have "hidden" class');
      });
    });
  }

  function testHide() {
    QUnit.module('hide', () => {
      test('hide method exists', assert => assert.ok(timer.hide, 'timer.hide is defined'));
      test('returns reference to timer', (assert) => {
        assert.equal(timer.hide(), timer);
      });
      test('adds "hidden" class to rootElement', (assert) => {
        appendTimerElement();
        timer.init(selector, seconds);
        $(selector).removeClass('hidden');
        timer.hide();
        assert.ok($(selector).hasClass('hidden'), 'root element has "hidden" class');
      });
    });
  }

  function testStart() {
    const startModuleHooks = {
      before() {
        startModuleHooks.setIntervalStub = sinon.stub(window, 'setInterval');
      },
      afterEach() {
        startModuleHooks.setIntervalStub.reset();
      },
      after() {
        startModuleHooks.setIntervalStub.restore();
      },
    };
    QUnit.module('start', startModuleHooks, () => {
      test('timer.start is a function', assert => assert.isFunction(timer.start));

      test('throws if timer is not initialized (timer.init has not been called)', (assert) => {
        const errorMatcher = /timer.start called before timer initialized/gi;
        assert.throws(timer.start, errorMatcher, 'throws with message if timer is not initialized');
      });

      test('returns a reference to to timer', (assert) => {
        appendTimerElement();
        timer.init(selector, seconds);
        assert.equal(timer.start(), timer, 'returns timer');
      });

      test('sets time remaining to initial time', (assert) => {
        appendTimerElement();
        timer.init(selector, 3);
        timer.start();
        assert.equal(timer.timeRemaining, 3, 'time remaining is when initial time is 3');
      });

      test('calls setInterval', (assert) => {
        const setInterval = startModuleHooks.setIntervalStub;
        appendTimerElement();
        timer.init(selector, seconds);
        timer.start();
        assert.ok(setInterval.calledOnce, 'called setInterval once');
        assert.ok(setInterval.calledWith(timer.tick, 1000), 'called with timer.tick and 1000 ms');
      });

      test('sets intervalId property', (assert) => {
        const id = 1;
        startModuleHooks.setIntervalStub.returns(id);
        appendTimerElement();
        timer.init(selector, seconds);
        timer.start();
        assert.equal(timer.intervalId, id, 'intervalId property = value returned by setInterval');
      });
    });
  }
});
