const { Timer, Clock } = require('../client/clockLogic.js');

jest.useFakeTimers();

describe('clockLogic', () => {
  describe('Timer', () => {
    it('adds a callback to the callbacks array with the addCallback method', () => {
      let timer = new Timer();
      let func = jest.fn();

      timer.addCallback(func);
      expect(timer.callbacks).toEqual(expect.arrayContaining([func]));
    });
    it('calls callbacks once every second', () => {
      let timer = new Timer();
      let func = jest.fn();

      timer.addCallback(func);
      jest.runTimersToTime(2000);
      expect(func.mock.calls.length).toBe(2);
    });
  });
  describe('Clock', () => {
    it('allows the user to set the time', () => {
      let clock = new Clock() 
      clock.setTime('00:00');

      expect(clock.time.hour).toBe('00');
      expect(clock.time.minute).toBe('00');
      expect(clock.time.second).toBe('00');
    });
    it('sets the time to the current time if no input is given', () => {
      let clock = new Clock();
      let now = new Date().toString().split(' ')[4];
      
      clock.setTime();
      expect(clock.time.hour).toBe(now.split(':')[0]);
      expect(clock.time.minute).toBe(now.split(':')[1]);
      expect(clock.time.second).toBe(now.split(':')[2]);
    });
    it('adds an alarm to the alarms array with the setAlarm method', () => {
      let clock = new Clock();
      
      expect(clock.alarms.length).toBe(0);
      clock.setAlarm('12:00');
      expect(clock.alarms.length).toBe(1);
    });
    it('calls updateTime every second', () => {
      let updateTimeHolder = Clock.prototype.updateTime;
      Clock.prototype.updateTime = jest.fn();
      let renderClockHolder = Clock.prototype.renderClock;
      Clock.prototype.renderClock = jest.fn();
      let clock = new Clock();
      
      clock.setTime('00:00');
      jest.runTimersToTime(2000);
      expect(clock.updateTime.mock.calls.length).toBe(2);

      Clock.prototype.updateTime = updateTimeHolder;
      Clock.prototype.renderClock = renderClockHolder;
    });
    it('Clock.time maintains the correct time', () => {
      let renderClockHolder = Clock.prototype.renderClock;
      Clock.prototype.renderClock = jest.fn();
      let clock = new Clock();

      clock.setTime('00:00');
      jest.runTimersToTime(1000);
      expect(clock.time.second).toEqual('01');
      jest.runTimersToTime(60000);
      expect(clock.time.minute).toEqual('01');
      jest.runTimersToTime(3600000);
      expect(clock.time.hour).toEqual('01');

      Clock.prototype.renderClock = renderClockHolder;
    });
    it('executes an alarm at the given time', () => {
      let triggerAlarmHolder = Clock.prototype.triggerAlarm;
      Clock.prototype.triggerAlarm = jest.fn();
      let renderClockHolder = Clock.prototype.renderClock;
      Clock.prototype.renderClock = jest.fn();
      let clock = new Clock();

      clock.setTime('00:00');
      clock.setAlarm('00:01');
      jest.runTimersToTime(59000);
      expect(clock.triggerAlarm).not.toBeCalled();
      jest.runTimersToTime(60000);
      expect(clock.triggerAlarm).toBeCalled();

      Clock.prototype.triggerAlarm = triggerAlarmHolder;
      Clock.prototype.renderClock = renderClockHolder;
    })
  });
});