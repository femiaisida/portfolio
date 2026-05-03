// weather.js
// Uses: postcodes.io (free, no key) + Open-Meteo (free, no key)

const HOT  = 27;
const COLD = 5;

const WMO_CODES = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mainly Clear',     icon: '🌤️' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy',            icon: '🌫️' },
  48: { label: 'Icy Fog',          icon: '🌫️' },
  51: { label: 'Light Drizzle',    icon: '🌦️' },
  53: { label: 'Drizzle',          icon: '🌦️' },
  55: { label: 'Heavy Drizzle',    icon: '🌧️' },
  61: { label: 'Light Rain',       icon: '🌧️' },
  63: { label: 'Rain',             icon: '🌧️' },
  65: { label: 'Heavy Rain',       icon: '🌧️' },
  71: { label: 'Light Snow',       icon: '🌨️' },
  73: { label: 'Snow',             icon: '❄️' },
  75: { label: 'Heavy Snow',       icon: '❄️' },
  80: { label: 'Rain Showers',     icon: '🌦️' },
  81: { label: 'Showers',          icon: '🌧️' },
  82: { label: 'Violent Showers',  icon: '⛈️' },
  95: { label: 'Thunderstorm',     icon: '⛈️' },
  96: { label: 'Thunderstorm',     icon: '⛈️' },
  99: { label: 'Thunderstorm',     icon: '⛈️' },
};

// ===== DOM =====
const postcodeInput = document.getElementById('postcode');
const forecastBtn   = document.getElementById('getForecast');
const emailInput    = document.getElementById('email');
const emailBtn      = document.getElementById('submitEmail');
const forecastGrid  = document.getElementById('forecast-grid');
const alertSection  = document.getElementById('alert-section');
const inputHint     = document.getElementById('input-hint');
const emailStatus   = document.getElementById('email-status');
const weatherIcon   = document.getElementById('weather-icon');

let currentForecast = null;

function isValidUKPostcode(p) {
  return /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(p.trim());
}

// ===== FETCH =====
forecastBtn.addEventListener('click', fetchForecast);
postcodeInput.addEventListener('keydown', e => { if (e.key === 'Enter') fetchForecast(); });

async function fetchForecast() {
  const raw      = postcodeInput.value.trim();
  inputHint.textContent = '';
  inputHint.style.color = '#e74c3c';

  if (!raw) { inputHint.textContent = 'Please enter a postcode.'; return; }
  if (!isValidUKPostcode(raw)) { inputHint.textContent = "That doesn't look like a valid UK postcode."; return; }

  forecastBtn.textContent = 'Loading…';
  forecastBtn.disabled    = true;
  forecastGrid.hidden     = true;
  alertSection.hidden     = true;

  try {
    // 1. Resolve postcode → lat/lng
    const geoRes  = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(raw)}`);
    const geoData = await geoRes.json();

    if (geoData.status !== 200) {
      inputHint.textContent = 'Postcode not found — try another.';
      return;
    }

    const { latitude: lat, longitude: lon, admin_district: area } = geoData.result;

    // 2. Get tomorrow's forecast from Open-Meteo
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateStr  = tomorrow.toISOString().slice(0, 10);

    const meteoUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max` +
      `&hourly=apparent_temperature` +
      `&timezone=Europe/London` +
      `&forecast_days=3`;

    const meteoRes  = await fetch(meteoUrl);
    const meteoData = await meteoRes.json();

    // Find index for tomorrow's date
    const idx = meteoData.daily.time.indexOf(dateStr);
    if (idx === -1) throw new Error('Date not found in forecast');

    const high  = Math.round(meteoData.daily.temperature_2m_max[idx]);
    const low   = Math.round(meteoData.daily.temperature_2m_min[idx]);
    const code  = meteoData.daily.weathercode[idx];
    const rain  = meteoData.daily.precipitation_sum[idx];
    const wind  = Math.round(meteoData.daily.windspeed_10m_max[idx]);
    const wmo   = WMO_CODES[code] || { label: 'Mixed', icon: '🌤️' };

    currentForecast = { high, low, code, rain, wind, wmo, area, dateStr };
    renderForecast(currentForecast);

  } catch (err) {
    console.error(err);
    inputHint.textContent = 'Something went wrong — please try again.';
  } finally {
    forecastBtn.textContent = 'Get Forecast';
    forecastBtn.disabled    = false;
  }
}

function renderForecast(f) {
  document.getElementById('location-name').textContent = f.area || '';
  document.getElementById('conditions').textContent    = f.wmo.label;
  document.getElementById('daySummary').textContent    =
    `${f.rain > 0 ? f.rain.toFixed(1) + 'mm of rain expected.' : 'No rain expected.'} Wind up to ${f.wind} km/h.`;
  document.getElementById('nightSummary').textContent  =
    `Low of ${f.low}°C overnight.`;
  document.getElementById('tempHigh').textContent = f.high;
  document.getElementById('tempLow').textContent  = f.low;

  weatherIcon.textContent = f.wmo.icon;
  forecastGrid.hidden     = false;

  const isHot  = f.high > HOT;
  const isCold = f.low  < COLD;

  if (isHot || isCold) {
    document.getElementById('alert-title').textContent =
      isHot ? '🔥 Extreme heat alert' : '🧊 Extreme cold alert';
    document.getElementById('alert-desc').textContent =
      isHot
        ? `Tomorrow's high of ${f.high}°C is unusually warm. Stay hydrated and avoid prolonged sun exposure. Get an email reminder below.`
        : `Tomorrow's low of ${f.low}°C is very cold. Dress warmly and check on vulnerable people nearby. Get an email reminder below.`;
    alertSection.hidden = false;
  } else {
    alertSection.hidden = true;
  }
}

// ===== SEND EMAIL ALERT =====
emailBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  emailStatus.textContent = '';

  if (!email) { emailStatus.textContent = 'Please enter your email address.'; return; }
  if (!currentForecast) { emailStatus.textContent = 'Get a forecast first.'; return; }

  emailBtn.textContent = 'Sending…';
  emailBtn.disabled    = true;

  const isHot = currentForecast.high > HOT;
  const msg   = isHot
    ? `It will be very hot tomorrow in ${currentForecast.area} (${currentForecast.high}°C). Stay cool and hydrated.`
    : `It will be very cold tomorrow in ${currentForecast.area} (${currentForecast.low}°C). Bundle up and stay warm.`;

  emailjs.send('service_pliykwl', 'template_cpdx3ic', {
    to_email: email,
    subject:  `Extreme Weather Alert — ${currentForecast.area}`,
    message:  msg,
  })
  .then(() => {
    emailStatus.textContent = '✅ Alert sent! Check your inbox (and spam).';
    emailInput.value = '';
  })
  .catch(err => {
    console.error(err);
    emailStatus.textContent = '❌ Failed to send — please try again.';
  })
  .finally(() => {
    emailBtn.textContent = 'Send Alert';
    emailBtn.disabled    = false;
  });
});
