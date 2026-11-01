// Лабораторна робота 19. Валютний інформер
// Виконала: Безкровна Анастасія Дмитрівна
const API_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
let currencies = [];

function showDate(data) {
  // НБУ повертає дату курсу у форматі dd.mm.yyyy.
  const date = data.length > 0 ? data[0].exchangedate : new Date().toLocaleDateString('uk-UA');
  document.getElementById('current-date').textContent = date;
}

function renderCurrencies(data) {
  const list = document.getElementById('currency-list');
  list.innerHTML = '';
  data.forEach(currency => {
    const li = document.createElement('li');
    li.className = 'currency-item';
    const description = document.createElement('span');
    description.textContent = currency.cc + ' — ' + currency.txt;
    const rate = document.createElement('strong');
    rate.textContent = Number(currency.rate).toFixed(4) + ' грн';
    li.append(description, rate);
    list.appendChild(li);
  });
}

function fillDatalists(data) {
  const lists = [document.getElementById('currency-select'), document.getElementById('currency-select-reverse')];
  lists.forEach(list => {
    list.innerHTML = '';
    data.forEach(currency => {
      const option = document.createElement('option');
      option.value = currency.cc;
      option.label = currency.txt;
      option.dataset.rate = currency.rate;
      list.appendChild(option);
    });
  });
}

function getRate(listId, inputId) {
  const selected = document.getElementById(inputId).value.trim().toUpperCase();
  const options = document.getElementById(listId).options;
  for (const option of options) {
    if (option.value === selected) {
      const rate = Number(option.dataset.rate);
      return Number.isFinite(rate) && rate > 0 ? rate : null;
    }
  }
  return null;
}

function convertToUah() {
  const input = document.getElementById('amount-foreign');
  const output = document.getElementById('amount-uah');
  const rate = getRate('currency-select', 'currency-input');
  if (input.value.trim() === '' || rate === null || !Number.isFinite(input.valueAsNumber) || input.valueAsNumber < 0) {
    output.value = '';
    return;
  }
  output.value = (input.valueAsNumber * rate).toFixed(2);
}

function convertFromUah() {
  const input = document.getElementById('amount-uah-source');
  const output = document.getElementById('amount-foreign-result');
  const rate = getRate('currency-select-reverse', 'currency-input-reverse');
  if (input.value.trim() === '' || rate === null || !Number.isFinite(input.valueAsNumber) || input.valueAsNumber < 0) {
    output.value = '';
    return;
  }
  output.value = (input.valueAsNumber / rate).toFixed(2);
}

function loadCurrencies() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) throw new Error('Порожня або некоректна відповідь API');
      currencies = data;
      showDate(currencies);
      renderCurrencies(currencies);
      fillDatalists(currencies);
      document.getElementById('status').textContent = 'Курси завантажено. 1 одиниця валюти = вказана сума в гривнях.';
      convertToUah();
      convertFromUah();
    })
    .catch(err => {
      console.error('Помилка завантаження даних:', err);
      document.getElementById('status').textContent = 'Не вдалося отримати курси НБУ. Перевірте підключення до інтернету й оновіть сторінку.';
      document.getElementById('currency-list').innerHTML = '<li class="currency-item">Дані тимчасово недоступні.</li>';
    });
}

// Для першого завдання: приклад запиту, який можна виконати в Console браузера:
// fetch(API_URL).then(response => response.json())
//   .then(data => console.log(data.find(item => item.cc === 'USD')))
//   .catch(err => console.error(err));

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('uk-UA');
  document.getElementById('amount-foreign').addEventListener('input', convertToUah);
  document.getElementById('currency-input').addEventListener('input', convertToUah);
  document.getElementById('currency-input').addEventListener('change', convertToUah);
  document.getElementById('amount-uah-source').addEventListener('input', convertFromUah);
  document.getElementById('currency-input-reverse').addEventListener('input', convertFromUah);
  document.getElementById('currency-input-reverse').addEventListener('change', convertFromUah);
  loadCurrencies();
});
