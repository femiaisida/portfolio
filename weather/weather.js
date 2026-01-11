// weather.js

document.addEventListener("DOMContentLoaded", () => {
  let currentForecast = {};
  const hotThreshold = 25;
  const coldThreshold = 8;

  const postcodeInput = document.getElementById("postcode");
  const forecastButton = document.getElementById("getForecast");
  const emailInput = document.getElementById("email");
  const emailButton = document.getElementById("submitEmail");

  // Simulated weather data (replace with real API if needed)
  function getMockForecast(postcode) {
    return {
      conditions: "Sunny",
      day_summary: "Clear skies throughout the day.",
      night_summary: "Mild and calm.",
      temperature_high: 32,
      temperature_low: 14
    };
  }

  // Display forecast in the UI
  function updateForecastDisplay(forecast) {
    document.getElementById("conditions").textContent = forecast.conditions;
    document.getElementById("daySummary").textContent = forecast.day_summary;
    document.getElementById("nightSummary").textContent = forecast.night_summary;
    document.getElementById("tempHigh").textContent = forecast.temperature_high;
    document.getElementById("tempLow").textContent = forecast.temperature_low;
  }

  // Handle forecast fetch
  forecastButton?.addEventListener("click", () => {
    const postcode = postcodeInput.value.trim();
    if (!postcode) {
      alert("Please enter a postcode.");
      return;
    }

    currentForecast = getMockForecast(postcode);
    updateForecastDisplay(currentForecast);
  });

  // Handle email alert
  emailButton?.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (!email) {
      alert("Please provide an email address.");
      return;
    }

    if (!window.emailjsReady) {
      alert("Email service is still loading. Please try again in a few seconds.");
      return;
    }

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

    const templateParams = {
      to_email: email,
      subject: "Extreme Weather Alert!",
      message: message
    };

    emailjs.send("service_pliykwl", "template_cpdx3ic", templateParams)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert("Extreme weather alert sent successfully!");
      })
      .catch((error) => {
        console.error("FAILED...", error);
        alert("Failed to send email. Please try again later.");
      });
  });
});