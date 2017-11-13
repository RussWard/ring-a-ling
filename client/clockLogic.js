class Timer {
  constructor() {
    this.count = 0;
    this.callbacks = [];
    setInterval(this.tick.bind(this), 1000);
  }
  addCallback(cb) {
    this.callbacks.push(cb);
  }
  tick() {
    this.count++;
    this.callbacks.forEach(cb => {cb(this.count)});
  }
}

class Clock {
  constructor() {
    this.time;
    this.alarms = [];
  }
  setTime(time) {
    let timeString;
    !time ? timeString = new Date().toString().split(' ')[4] : timeString = time + ':00';
    this.time = {
      hour: timeString.split(':')[0],
      minute: timeString.split(':')[1],
      second: timeString.split(':')[2]
    }
    this.runClock();
  }
  renderClock() {
    document.getElementById('hour').innerHTML = this.time.hour;
    document.getElementById('minute').innerHTML = this.time.minute;
    document.getElementById('second').innerHTML = this.time.second;  
  }
  updateTime() {
    this.time.second = this.incrementString(this.time.second);
    if (this.time.second === '60') {
      this.time.second = '00';
      this.time.minute = this.incrementString(this.time.minute);
      if (this.time.minute === '60') {
        this.time.minutes = '00';
        this.time.hour = this.incrementString(this.time.hour);
        if (this.time.hour === 24) {
          this.time.hour = '00';
        }
      }
    }
    this.checkAlarms();
    this.renderClock();
  }
  incrementString(string) {
    let tens = parseInt(string[0]);
    let ones = parseInt(string[1]);
    ones++;
    if (ones === 10) {
      ones = 0;
      tens++; 
    };
    if (tens === 10) { tens = 0 };
    return tens.toString() + ones.toString();
  }
  runClock() {
    const timer = new Timer();
    timer.addCallback(this.updateTime.bind(this));
  }
  setAlarm(alarmTime) {
    this.alarms.push(alarmTime + ':00');
  }
  checkAlarms() {
    if (this.alarms.includes(this.time.hour + ':' + this.time.minute + ':' + this.time.second)) {
      this.triggerAlarm();
    }
  }
  triggerAlarm() {
    document.getElementById('alarm-sound').play();
  }
}

let clock = new Clock();

module.exports = {
  Timer,
  Clock
};
