class QuizTimer { // eslint-disable-line
  constructor() {
    this.secondsRemaining = 120;
    this.onChange = null;
    this.onTimeUp = null;
  }

  stop() {
    window.clearInterval(this.intervalId);
  }

  start() {
    this.intervalId = window.setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.secondsRemaining -= 1;
    if (this.onChange) this.onChange(this.secondsRemaining);
    const isTimeOut = this.secondsRemaining <= 0;
    if (isTimeOut) this.stop();
    if (isTimeOut && this.onTimeUp) this.onTimeUp();
  }
}
