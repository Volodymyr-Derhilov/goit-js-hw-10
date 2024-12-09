'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const delay = document.querySelector('[name = "delay"]');
const form = document.querySelector('.form');
const state = document.querySelector('.form fieldset');
const promiseState = {
  state: '',
  delay: '',
};

state.addEventListener('click', handleClick);

form.addEventListener('submit', handleSubmit);

function handleClick(event) {
  if (event.target.tagName === 'INPUT') {
    promiseState.state = event.target.value;
    return;
  }
}

function handleSubmit(event) {
  promiseState.delay = delay.value;
  event.preventDefault();
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (promiseState.state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${promiseState.delay}ms`);
      } else if (promiseState.state === 'rejected') {
        reject(`❌ Rejected promise in ${promiseState.delay}ms`);
      }
    }, promiseState.delay);
  });

  promise
    .then(value =>
      iziToast.show({
        message: value,
        messageColor: '#fff',
        backgroundColor: '#59a10d',
        position: 'topRight',
        messageSize: '16px',
      })
    )
    .catch(error => {
      iziToast.show({
        message: error,
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        messageSize: '16px',
      });
    });

  form.reset();
}
