# Weather App | Vue


A Weather application created for [Critical Mention](https://www.criticalmention.com/) as a technical assignment. This Weather application is responsive, working on both desktop browser and mobile browser and has some useful functionalities. This Weather application project uses Vue.js on the frontend & consumes weather data from [OpenWeather](https://openweathermap.org/) API.

This Weather Application is hosted at [https://projects.pranilrathod.dev/weatherapp](https://projects.pranilrathod.dev/weatherapp)


## Features
- **Geolocation** - Get current location weather data using Geolocation API

-  **Location Search** - Search for location using text input(for e.g. London, Mumbai, New York) to get weather data for that specific location, this feature uses a method called as Forward Geocoding to fetch coordinates.

-  **Unit Conversion** - Toggle temperature unit in **°C** Celsius or **°F** Fahrenheit by clicking on temprature.


## Tech

- **Frontend**
	+ Vue
		+ Axios
		+ Moment.js
		+ Vuex (with local storage persistency)
	+ BEM Methodology (with SCSS)
- **Infrastructure**
	+ AWS
		+ S3 (Static website hosting)
		+ CloudFront (CDN caching for S3 static web hosting)
		+ CodePipeline (to fetch push/pull update from github repo and deploy to S3 with CodeBuild)
		+ CodeBuild (to build Vue project and deploy in S3 bucket)
		
## Project Setup (local)

Install all dependencies
```console
npm run install
```
Run on localhost
```console
npm run serve
```
