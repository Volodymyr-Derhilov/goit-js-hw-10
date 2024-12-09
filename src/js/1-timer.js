'use strict';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('.choise #datetime-picker');
const button = document.querySelector('.choise button');
const day = document.querySelector('[data-days]');
const hour = document.querySelector('[data-hours]');
const minute = document.querySelector('[data-minutes]');
const second = document.querySelector('[data-seconds]');

let timerInterval;
let selectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates.length === 0) {
      return;
    }

    const dateNow = Date.now();
    selectedDate = selectedDates[0];

    let deltaDate = selectedDate - dateNow;
    ifPossibleDate(deltaDate);
  },
};

flatpickr(input, options);

function updateTimerFace({ days, hours, minutes, seconds }) {
  day.textContent = `${days}`;
  hour.textContent = `${hours}`;
  minute.textContent = `${minutes}`;
  second.textContent = `${seconds}`;
}

function ifPossibleDate(delta) {
  if (delta > 0) {
    button.classList.add('active');
    button.disabled = false;

    button.addEventListener('click', handleStartTimer);
    return;
  }

  button.classList.remove('active');
  button.disabled = true;
  iziToast.error({
    message: 'Please choose a date in the future',
    position: 'topCenter',
  });
  //window.alert('Please choose a date in the future');
}

function handleStartTimer() {
  if (!button.classList.contains('active')) return;

  startTimer(selectedDate);
}

function startTimer(date) {
  button.classList.remove('active');
  input.disabled = true;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    let deltaDate = date - Date.now();

    if (deltaDate <= 0) {
      clearInterval(timerInterval);
      updateTimerFace({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });
      console.log('Timer has finished!');
      input.disabled = false;
      return;
    }

    const left = convertMs(deltaDate);
    updateTimerFace(left);
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = pad(Math.floor(ms / day));
  const hours = pad(Math.floor((ms % day) / hour));
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}
