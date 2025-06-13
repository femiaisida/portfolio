/* weather.js */

// Global variable to store the current forecast data.
let currentForecast = {};

// Simulated function to fetch forecast data (replace with real API call as needed).
function getMockForecast(postcode) {
  // In production, you would call a weather API using the postcode.
  return {
    conditions: "Sunny",
    day_summary: "Clear skies throughout the day.",
    night_summary: "Mild and calm.",
    temperature_high: 32,  // Example value: extreme heat
    temperature_low: 14    // Example value: normal cold
  };
}

// Event listener for "Get Tomorrow's Forecast" button.
document.getElementById('getForecast').addEventListener('click', () => {
  const postcode = document.getElementById('postcode').value.trim();
  if (!postcode) {
    alert("Please enter a postcode.");
    return;
  }

  // Get forecast data (using mock data here)
  currentForecast = getMockForecast(postcode);

  // Update the forecast display in the DOM.
  document.getElementById('conditions').textContent = currentForecast.conditions;
  document.getElementById('daySummary').textContent = currentForecast.day_summary;
  document.getElementById('nightSummary').textContent = currentForecast.night_summary;
  document.getElementById('tempHigh').textContent = currentForecast.temperature_high;
  document.getElementById('tempLow').textContent = currentForecast.temperature_low;
});

// Define extreme weather thresholds.
const hotThreshold = 25; // Temperatures above 25°C are considered very hot.
const coldThreshold = 8; // Temperatures below 8°C are considered very cold.

// Event listener for the "Enter" button (sending an email).
document.getElementById('submitEmail').addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  if (!email) {
    alert("Please provide an email address.");
    return;
  }

  // Evaluate forecast conditions.
  let message = "";
  if (currentForecast.temperature_high > hotThreshold) {
    message = "Warning: It will be very hot tomorrow! Stay cool and hydrated.";
  } else if (currentForecast.temperature_low < coldThreshold) {
    message = "Warning: It will be very cold tomorrow! Bundle up and stay warm.";
  }
  
  if (!message) {
    alert("Tomorrow's forecast is within normal ranges. No alert will be sent.");
    return;
  }

  // Prepare template parameters for EmailJS.
  const templateParams = {
    to_email: email,
    subject: "Extreme Weather Alert!",
    message: message
  };

  // Send email using EmailJS.
  emailjs.send('service_pliykwl', 'template_cpdx3ic', templateParams)
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Extreme weather alert sent successfully!");
    }, function(error) {
      console.log("FAILED...", error);
      alert("Failed to send email. Please try again later.");
    });
});
