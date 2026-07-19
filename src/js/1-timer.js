import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;

let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    startBtn.disabled = true;
    userSelectedDate = null;

    if (!selectedDate) {
      return;
    }

    if (selectedDate <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = selectedDate;

    startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', onStart);

function onStart() {
  startBtn.disabled = true;
  dateTimePicker.disabled = true;

  updateTimer();

  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const currentTime = new Date();
  const remainingTime = userSelectedDate - currentTime;

  if (remainingTime <= 0) {
    clearInterval(timerId);
    timerId = null;

    renderTimer({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    dateTimePicker.disabled = false;

    startBtn.disabled = true;
    userSelectedDate = null;

    return;
  }

  const time = convertMs(remainingTime);

  renderTimer(time);
}

function renderTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
