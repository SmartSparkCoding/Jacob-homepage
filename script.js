const background = document.getElementById("background");

async function getBackground() {
    const url = 
        "https://jacob-homepage-nasa.jacob-navaratne.workers.dev/";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (result.media_type !== "image") {
            console.log("APOD returned a non-image media type.");
            return null;
        }

        return result.url;
        } catch (error) {
        console.log(error.message);
        return null;
        }
}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (!imageUrl) return;

    console.log(imageUrl);

    if (background) {
      background.style["background-image"] = `url('${imageUrl}')`;
    }
  });
};

setInterval(() => {
    let dateObject = new Date();

    let date = dateObject.getTime();

    let offset = dateObject.getTimezoneOffset();
    let offsetMs = offset * 60 * 1000;

    date = date - offsetMs;

    let time = date % 86400000;
    
    let hours = Math.floor(time / 3600000);
    let minutes = Math.floor((time % 3600000) / 60000);
    let seconds = Math.floor((time % 60000) / 1000);

    document.getElementById("time").innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}, 1000);

let lat, lon;

navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;

    getWeather(); // run immediately once location is ready
    setInterval(getWeather, 10000); // update every 10 seconds
});

async function getWeather() {

    if (!lat || !lon) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation_probability&temperature_unit=celsius&wind_speed_unit=mph`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        let temp = result.current.temperature_2m;
        let wind = result.current.wind_speed_10m;
        let rain = result.current.precipitation_probability;

        document.getElementById("weather").innerText =
            `${rain}% ${temp}°C ${wind} MPH`;

    } catch (error) {
        console.log(error.message);
    }
}

function updateLifeCounter() {
    const now = new Date();

    const birth = new Date(2012, 4, 29); 

    let diff = now.getTime() - birth.getTime();

    let totalSeconds = Math.floor(diff / 1000);

    let minutes = Math.floor(totalSeconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    document.getElementById("life").innerText =
        `${totalSeconds.toLocaleString()} Uptime in Seconds`;
}

updateLifeCounter();
setInterval(updateLifeCounter, 1000);
