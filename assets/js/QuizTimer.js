class QuizTimer { // eslint-disable-line
  constructor() {
    this.secondsRemaining = 120;
    this.onChange = null;
    this.onTimeUp = null;
  }

  tick() {
    this.secondsRemaining -= 1;
    if (this.onChange) this.onChange(this.secondsRemaining);
    const isTimeOut = this.secondsRemaining <= 0;
    if (isTimeOut) window.clearInterval(this.intervalId);
    if (isTimeOut && this.onTimeUp) this.onTimeUp();
  }

  start() {
    this.intervalId = window.setInterval(() => this.tick(), 1000);
  }
}
