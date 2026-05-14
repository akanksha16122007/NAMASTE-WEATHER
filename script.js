async function getWeather() {
  const button = document.getElementById("searchButton");
  const searchInput = document.getElementById("search");

  function startLoading() {
    button.classList.add("loading");
    button.setAttribute("disabled", "disabled");
  }

  function stopLoading() {
    button.classList.remove("loading");
    button.removeAttribute("disabled");
  }

  try {
    const city = searchInput.value.trim();
    if (!city) {
      alert("Please enter a city:");
      return;
    }

    startLoading();
    document.getElementById("result").innerHTML =
      '<h3 class="subtext">Looking up weather for ' + city + "...</h3>";
    document.getElementById("temp").innerHTML = "";

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`,
    );

    const geoData = await geoRes.json();
    if (!geoData.results) {
      alert("City not found");
      return;
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability`,
    );
    const data = await weatherRes.json();
    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;
    const rainChance = data.hourly.precipitation_probability[0];

    document.getElementById("result").innerHTML = `
      <h1>🌍 ${city}</h1>
      <h3>🌡️ Temperature: ${temp}°C</h3>
      <h3>💨 Wind Speed: ${wind} km/h</h3>
      <h3>🌧️ Precipitation: ${rainChance}%</h3>
    `;

    if (temp > 30) {
      document.getElementById("temp").innerHTML =
        `<h3>☀️ Weather Type: Sunny</h3>`;
      alert("🥵 It's hot! Stay hydrated 💧");
      document.body.style.backgroundImage =
        "url('https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=612x612&w=0&k=20&c=MGd2-v42lNF7Ie6TtsYoKnohdCfOPFSPQt5XOz4uOy4=')";
    } else if (temp >= 20 && temp <= 30) {
      document.getElementById("temp").innerHTML =
        `<h3>☁️ Weather Type: Cloudy</h3>`;
      alert("📸 Perfect aesthetic sky for photos!");
      document.body.style.backgroundImage =
        "url('https://t4.ftcdn.net/jpg/05/13/26/73/360_F_513267391_QEmNGeOFLLqrILTnoq21dReUPp5UsoNr.jpg')";
    } else if ((temp < 20 && temp >= 15) || rainChance > 50) {
      document.getElementById("temp").innerHTML =
        `<h3>🌧️ Weather Type: Rainy</h3>`;
      alert("🌧️ Perfect weather for chai + pakoras 🍵");
      document.body.style.backgroundImage =
        "url('https://t4.ftcdn.net/jpg/16/52/66/41/360_F_1652664174_KHr08RB9DI3HT4s6aJQBEygZVYAVkM8y.jpg')";
    } else if (temp < 15 && temp >= 10) {
      document.getElementById("temp").innerHTML =
        `<h3>⛈️ Weather Type: Stormy</h3>`;
      alert("⚡ Thunderstorm incoming! Stay indoors!");
      document.body.style.backgroundImage =
        "url('https://c4.wallpaperflare.com/wallpaper/5/528/863/lightning-thunder-sky-lightning-strikes-wallpaper-preview.jpg')";
    } else if ((temp < 10 && temp >= 0) || wind > 10) {
      document.getElementById("temp").innerHTML =
        `<h3>🌬️ Weather Type: Windy</h3>`;
      alert("💨 It's windy! Hold your hair and your phone!");
      document.body.style.backgroundImage =
        "url('https://c0.wallpaperflare.com/preview/556/693/130/trees-path-palm-trees-wind.jpg')";
    } else if (temp < 0) {
      document.getElementById("temp").innerHTML =
        `<h3>❄️ Weather Type: Snowy</h3>`;
      alert("🧦 Layer up or regret it!");
      document.body.style.backgroundImage =
        "url('https://images.unsplash.com/photo-1418985991508-e47386d96a71?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c25vdyUyMHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D')";
    }
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundSize = "cover";
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("result").innerHTML =
      '<h3 class="subtext">Unable to load weather. Try again later.</h3>';
  } finally {
    stopLoading();
  }
}
