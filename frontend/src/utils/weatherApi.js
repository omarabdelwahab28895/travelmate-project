export const fetchWeather = async (city) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=82b4276d0bf82dd356f5f41dc4fe9ce1&units=metric&lang=it`);
      const data = await res.json();
  
      return {
        name: data.name,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed
      };
    } catch (err) {
      console.error("Errore caricamento meteo:", err);
      return null;
    }
  };
  