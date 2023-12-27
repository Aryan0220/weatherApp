import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = process.env.port || 3000;
const app = express();
const API_KEY = "add3d03ff265a0973b703c22af29f95b";
const weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?";
const geoAPI_URL = "http://api.openweathermap.org/geo/1.0/direct?q=";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const geoResponse = await axios.get(
      geoAPI_URL + "bhopal" + "&limit=5&appid=" + API_KEY
    );
    const latitude = geoResponse.data[0].lat;
    const longitude = geoResponse.data[0].lon;
    try {
      const response = await axios.get(
        `${weatherAPI_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const result = response.data;
      const actualTemp = Math.floor(result.main.temp - 273.15);
      const feelTemp = Math.floor(result.main.feels_like - 273.15);
      res.render("index.ejs", {
        city: geoResponse.data[0].name,
        condition: result.weather[0].main,
        actualTemperature: actualTemp,
        feelTemperature: feelTemp,
        humidity: result.main.humidity,
      });
    } catch (error) {
      console.error("Failed to load the site.", error.message);
      res.render("index.ejs", { city: "Unable to fetch weather details." });
    }
  } catch (error) {
    console.error("Failed to load the site: ", error.message);
    res.render("index.ejs", { city: "Please enter a vaild location." });
  }
});

app.post("/", async (req, res) => {
  const enteredCity = req.body.cityName;
  try {
    const geoResponse = await axios.get(
      geoAPI_URL + enteredCity + "&limit=5&appid=" + API_KEY
    );
    const latitude = geoResponse.data[0].lat;
    const longitude = geoResponse.data[0].lon;
    try {
      const response = await axios.get(
        `${weatherAPI_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const result = response.data;
      const actualTemp = Math.floor(result.main.temp - 273.15);
      const feelTemp = Math.floor(result.main.feels_like - 273.15);
      res.render("index.ejs", {
        city: geoResponse.data[0].name,
        condition: result.weather[0].main,
        actualTemperature: actualTemp,
        feelTemperature: feelTemp,
        humidity: result.main.humidity,
      });
    } catch (error) {
      console.error("Failed to load the site.", error.message);
      res.render("index.ejs", { city: "Unable to fetch weather details." });
    }
  } catch (error) {
    console.error("Failed to load the site: ", error.message);
    res.render("index.ejs", { city: "Please enter a vaild location." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
