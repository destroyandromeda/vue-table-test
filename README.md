# wazzup-f-vue2
# О самой таблице 
## `<CustomTable :thToTd="mask" :allInfo="info" :rows="10" :status="status"/>`
## thToTd -> маска для вывода значенией в данных, так как изначально она адаптируется к данным с вложенными полями
<pre>
{
    %Имя_для_заголовка%: %путь_до_значения_в_объекте_js%
}
</pre>
## Пример
<pre>
{
  "fullname": 'fullname',
  "uname": 'uname',
  "company": 'company',
  "email": 'email',
  "streetAddress": 'address.streetAddress',
  "city": 'address.city',
  "state": 'address.state',
  "zip": 'address.zip'
}
</pre>
## allInfo -> массив данных
## rows -> строк на странице
## status -> статус загрузки данных 
pure - не использовался
load - загружается
ok - загрузился
error - ошибка
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
