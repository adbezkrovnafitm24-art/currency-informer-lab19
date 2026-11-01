# Лабораторна робота 19 — Валютний інформер

Виконала: **Безкровна Анастасія Дмитрівна**, група **Інб-1-24-4-0д**.

Вебзастосунок отримує актуальний офіційний курс валют із JSON API НБУ через `fetch()` та `.then()`, показує дату і перелік валют, а також незалежно конвертує іноземні валюти в гривні та гривні в іноземні валюти.




```javascript
fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
  .then(response => response.json())
  .then(data => console.log(data.find(item => item.cc === 'USD')))
  .catch(err => console.error(err));
```



Джерело: https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
