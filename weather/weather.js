// weather.js
// NOTE: Uses mock data — replace getMockForecast() with a real API call
// (e.g. Open-Meteo + postcodes.io) when you have an API key.

const HOT  = 25;
const COLD = 8;

const WEATHER_ICONS = {
  'Sunny': '☀️', 'Clear': '🌙', 'Cloudy': '☁️',
  'Partly Cloudy': '⛅', 'Rain': '🌧️', 'Heavy Rain': '⛈️',
  'Snow': '❄️', 'Fog': '🌫️', 'Windy': '💨',
};

function getMockForecast(postcode) {
  // Simulated data — swap for real API response
  return {
    conditions:   'Partly Cloudy',
    day_summary:  'Mild with sunny intervals and light cloud cover in the afternoon.',
    night_summary:'Cooling down with clear spells expected overnight.',
    temperature_high: 28,
    temperature_low:  12,
  };
}

function formatPostcode(raw) {
  return raw.trim().toUpperCase().replace(/\s+/g, ' ');
}

function isValidUKPostcode(postcode) {
  const re = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  return re.test(postcode.trim());
}

// ===== DOM REFS =====
const postcodeInput  = document.getElementById('postcode');
const forecastBtn    = document.getElementById('getForecast');
const emailInput     = document.getElementById('email');
const emailBtn       = document.getElementById('submitEmail');
const forecastGrid   = document.getElementById('forecast-grid');
const alertSection   = document.getElementById('alert-section');
const inputHint      = document.getElementById('input-hint');
const emailStatus    = document.getElementById('email-status');
const weatherIcon    = document.getElementById('weather-icon');

let currentForecast = null;

// ===== FETCH FORECAST =====
forecastBtn.addEventListener('click', () => {
  const postcode = formatPostcode(postcodeInput.value);
  inputHint.textContent = '';

  if (!postcode) {
    inputHint.textContent = 'Please enter a postcode.';
    return;
  }

  if (!isValidUKPostcode(postcode)) {
    inputHint.textContent = 'That doesn\'t look like a valid UK postcode.';
    return;
  }

  currentForecast = getMockForecast(postcode);
  renderForecast(currentForecast);
});

postcodeInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') forecastBtn.click();
});

function renderForecast(f) {
  document.getElementById('conditions').textContent   = f.conditions;
  document.getElementById('daySummary').textContent   = f.day_summary;
  document.getElementById('nightSummary').textContent = f.night_summary;
  document.getElementById('tempHigh').textContent     = f.temperature_high;
  document.getElementById('tempLow').textContent      = f.temperature_low;

  weatherIcon.textContent = WEATHER_ICONS[f.conditions] || '🌤️';

  forecastGrid.hidden = false;

  // Show alert section if extreme
  const isHot  = f.temperature_high > HOT;
  const isCold = f.temperature_low  < COLD;

  if (isHot || isCold) {
    document.getElementById('alert-title').textContent =
      isHot ? '🔥 Extreme heat alert' : '🧊 Extreme cold alert';
    document.getElementById('alert-desc').textContent =
      isHot
        ? `Tomorrow's high of ${f.temperature_high}°C is above our hot threshold. Stay hydrated and avoid prolonged sun exposure. Enter your email to receive a reminder.`
        : `Tomorrow's low of ${f.temperature_low}°C is below our cold threshold. Dress warmly and check on vulnerable people. Enter your email to receive a reminder.`;
    alertSection.hidden = false;
  } else {
    alertSection.hidden = true;
  }
}

// ===== SEND ALERT EMAIL =====
emailBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  emailStatus.textContent = '';

  if (!email) {
    emailStatus.textContent = 'Please enter your email address.';
    return;
  }

  if (!currentForecast) {
    emailStatus.textContent = 'Get a forecast first.';
    return;
  }

  if (!window.emailjsReady) {
    emailStatus.textContent = 'Email service not ready — please try again.';
    return;
  }

  emailBtn.textContent = 'Sending…';
  emailBtn.disabled = true;

  const isHot = currentForecast.temperature_high > HOT;
  const msg   = isHot
    ? `Warning: It will be very hot tomorrow (${currentForecast.temperature_high}°C). Stay cool and hydrated.`
    : `Warning: It will be very cold tomorrow (${currentForecast.temperature_low}°C). Bundle up and stay warm.`;

  emailjs.send('service_pliykwl', 'template_cpdx3ic', {
    to_email: email,
    subject:  'Extreme Weather Alert!',
    message:  msg,
  })
  .then(() => {
    emailStatus.textContent = '✅ Alert sent! Check your inbox (and spam).';
    emailInput.value = '';
  })
  .catch(err => {
    console.error(err);
    emailStatus.textContent = '❌ Failed to send — please try again later.';
  })
  .finally(() => {
    emailBtn.textContent = 'Send Alert';
    emailBtn.disabled = false;
  });
});
