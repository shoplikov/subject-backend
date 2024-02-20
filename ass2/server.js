const express = require('express');
const axios = require('axios');
const request = require('request');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

// WEATHER 
const openWeatherApiKey = '9fed280c844f7eebb73c1a5a57e99e22';

app.get('/weather', (req, res) => {
  res.render('weather', { weatherData: null });
});

app.get('/weather/retrieve', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`
    );
    const weatherData = weatherResponse.data;
    res.render('weather', { weatherData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// CITY TO COORDINATES
const geocodeApiKey = 'Z6t4+EigQpyVMCbic9NNwg==xHINB12b5S0IPdQ0';

app.get('/city_coordinates', (req, res) => {
  res.render('city_coordinates', { cityData: null });
});

app.get('/city_coordinates/retrieve', async (req, res) => {
  try {
    const { city, state, country } = req.query;

    const apiUrl = `https://api.api-ninjas.com/v1/geocoding?city=${city}&state=${state}&country=${country}`;
    
    const options = {
      url: apiUrl,
      headers: {
        'X-Api-Key': geocodeApiKey,
      },
    };

    request.get(options, function(error, response, body) {
      if (error) return console.error('Request failed:', error);
      else if (response.statusCode !== 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
      
      const cityData = JSON.parse(body)[0];
      res.render('city_coordinates', { cityData });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// WEATHER NEWS API 
const newsApiKey = '1e8386efeda64244a0f4dc35ff3f75f2';

app.get('/location-news', (req, res) => {
  res.render('location_news', { newsData: null });
});

app.get('/location-news/retrieve', async (req, res) => {
  try {
    const { keyword } = req.query;

    const newsResponse = await axios.get(
      `https://newsapi.org/v2/top-headlines?q=${keyword}&apiKey=${newsApiKey}`
    );
    const newsData = newsResponse.data;

    res.render('location_news', { newsData });
  } catch (error) {
    console.error('Error fetching news data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
