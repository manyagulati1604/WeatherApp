const express = require('express');
const bodyParser = require('body-parser');
const api_key = 'bfcf142e6a9777c32405ae81e8b19a59';
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
  res.render('index', { weather: null, forecast: null, error: null });
});
app.post('/', async function (req, res) {
  let city = req.body.city;
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;
  try {
    const weatherResponse = await fetch(weatherUrl);
    const weather = await weatherResponse.json();
    if (weather.main === undefined) {
      res.render('index', { weather: null, forecast: null, error: 'Error, please try again' });
      return;
    }
    const forecastResponse = await fetch(forecastUrl); 
    const forecastData = await forecastResponse.json();
    let dailyForecast = [];
    let lastDate = "";
    forecastData.list.forEach(item => {
      let date = new Date(item.dt * 1000);
      let dateString = date.toLocaleDateString();
      if (dateString !== lastDate && date.getHours() === 12) {
        let forecastText = `${dateString}: ${item.main.temp} °C, ${item.weather[0].description}`;
        dailyForecast.push(forecastText);
        lastDate = dateString;
      }
    });
    let weatherText = `${weather.name} is currently: ${weather.main.temp} °C`;
    res.render('index', { weather: weatherText, forecast: dailyForecast, error: null });
  } catch (err) {
    res.render('index', { weather: null, forecast: null, error: 'Error, please try again' });
  }
});
app.listen(3000, function () {
  console.log('Weather app listening on port 3000!');
});
