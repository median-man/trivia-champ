const timer = {
  init(rootElementSelector, seconds, settings) {
    this.rootElement = document.querySelector(rootElementSelector);
    if (!this.rootElement) {
      throw new Error(`invalid rootElementSelector: ${rootElementSelector}`);
    }

    this.initialTime = seconds;

    if (settings) {
      Object.assign(this, settings);
    }

    this.isInitialized = true;
    return this;
  },

  render() {
    $(this.rootElement).text(`Timer: ${timer.timeRemaining}`);
    return this;
  },

  hide() {
    $(this.rootElement).addClass('hidden');
    return this;
  },

  show() {
    $(this.rootElement).removeClass('hidden');
    return this;
  },

  start() {
    if (!this.isInitialized) {
      throw new Error('timer.start called before timer initialized');
    }
    this.timeRemaining = this.initialTime;
    const second = 1000;
    timer.intervalId = window.setInterval(timer.tick, second);
    return this;
  },

  tick() {
    if (timer.timeRemaining > 0) {
      timer.timeRemaining -= 1;
      timer.render();
    } else {
      timer.onTimeOut();
    }
  },
};
