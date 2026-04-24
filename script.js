const apiKey = "0ccc755149e791cb49ee5721999d4f67";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const result = document.getElementById("weatherResult");

  result.innerHTML = "⏳ Loading...";

  try {
    // 🌤 Current Weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const currentData = await currentRes.json();

    // 📅 Forecast (5 days)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();

    if (currentData.cod === 200) {
      displayWeather(currentData, forecastData);
    } else {
      result.innerHTML = "❌ City not found";
    }

  } catch (error) {
    result.innerHTML = "⚠️ Error fetching data";
  }
}

function displayWeather(current, forecast) {
  const result = document.getElementById("weatherResult");

  const icon = current.weather[0].icon;

  // 🧠 Extract 1 forecast per day (no duplicates)
  const daily = forecast.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  let forecastHTML = "";

  daily.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.weather[0].icon;

    forecastHTML += `
      <div class="forecast-item">
        <p>${dayName}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" />
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });

  result.innerHTML = `
    <div class="main-weather">
      <h2>${current.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
      <p class="temp">${current.main.temp}°C</p>
      <p>${current.weather[0].description}</p>
    </div>

    <div class="forecast">
      <h3>5-Day Forecast</h3>
      <div class="forecast-container">
        ${forecastHTML}
      </div>
    </div>
  `;
}