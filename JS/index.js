const apiKey = '9990fa9a7ff958787a973d1c1e2bf14a'

const infoContainer = document.querySelector('#info-containter')
const cityInput = document.querySelector('#city-value')
const button = document.querySelector('.search')

const emojis = {
  '01d': '☀️',
  '02d': '⛅️',
  '03d': '☁️',
  '04d': '☁️',
  '09d': '🌧',
  '10d': '🌦',
  '11d': '⛈',
  '13d': '❄️',
  '50d': '💨',
  '01n': '☀️',
  '02n': '⛅️',
  '03n': '☁️',
  '04n': '☁️',
  '09n': '🌧',
  '10n': '🌦',
  '11n': '⛈',
  '13n': '❄️',
  '50n': '💨',
};

const fetchData = async (city, d) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    console.log(data);
    const name = data.name;
    const emoji = emojis[data.weather[0].icon];
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const description = data.weather[0].description;

    const html = createCardHtml(name, emoji, temp, feelsLike, description, d);

    infoContainer.innerHTML = html;
  } catch(err) {
    alert(err)
  }
}

button.addEventListener('click', () => {
  const city = cityInput.value
  let d = new Date(Date.now());
  d.toString()
  fetchData(city, d)
})

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value
    let d = new Date(Date.now());
    d.toString()
    fetchData(city, d)
  }
})

const fetchGeoData = async (lat, lon, d) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  const name = data.name;
  const emoji = emojis[data.weather[0].icon];
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const description = data.weather[0].description;

  const html = createCardHtml(name, emoji, temp, feelsLike, description, d);

  infoContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  let d = new Date(Date.now());
  d.toString()
  if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      fetchGeoData(lat, lon, d)
    }, (error) => {
      if (error.code == error.PERMISSION_DENIED)
      fetchData('antarctica', d)
    }
    );
  } else {
    infoContainer.innerHTML = "Geolocation is not supported by this browser."
  }
})

const createCardHtml = (name, emoji, temp, feelsLike, description, d) => 
  `
  <div class="row p-4" id="card-container">
    <h2 class="card-title mb-3 display-4 fw-bold">${name}</h2>
    <p class="text-muted lead">${d}</p>
    <div class="row align-items-center">    
      <div class="col-lg-1 h1 text-end">                
        ${emoji}
      </div>
      <div class="col-lg-1 small-screen h1">                
      ${temp}&#176;c
      </div>
      <div class="col-lg-10">
        <div class="card-body">
          <div class="row justify-content-between text-end">
            <h5 class="text-muted mb-3">${description}</h4>
            <h5 class="text-muted">feels like ${feelsLike}&#176;c</h6>
          </div>
        </div>
      </div>
  </div>
 `