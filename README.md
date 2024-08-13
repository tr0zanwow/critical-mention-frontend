# Weather App | Vue ![Vue.js Badge](https://img.shields.io/badge/Vue.js-3.0-green) ![AWS Badge](https://img.shields.io/badge/AWS-Cloud-orange)

A responsive Weather Application developed as a demonstration project. This application is optimized for both desktop and mobile browsers, offering a seamless user experience with valuable functionalities. The project is built using Vue.js for the frontend and integrates weather data from the OpenWeather API.

![Weather App Screenshot](https://raw.githubusercontent.com/tr0zanwow/portfolio-website/master/images/weather-app.webp)

## [Live Demo](https://projects.pranilrathod.dev/weatherapp)

### Features

- **Geolocation**  
  Automatically fetch and display weather data for the user's current location using the Geolocation API.

- **Location Search**  
  Search for weather information by entering a location name (e.g., London, Mumbai, New York). This feature utilizes Forward Geocoding to convert the location name into geographic coordinates.

- **Unit Conversion**  
  Toggle between Celsius (°C) and Fahrenheit (°F) temperature units by clicking on the displayed temperature.

### Technology Stack

#### Frontend
- **Vue.js** - Progressive JavaScript framework for building user interfaces.
- **Axios** - Promise-based HTTP client for making API requests.
- **Moment.js** - Library for parsing, validating, manipulating, and formatting dates.
- **Vuex** - State management pattern + library for Vue.js, with local storage persistence.
- **SCSS with BEM Methodology** - CSS preprocessor with BEM naming convention for organized and maintainable styles.

#### Infrastructure
- **AWS S3** - Static website hosting for serving the application.
- **AWS CloudFront** - CDN for optimized content delivery with caching mechanisms.
- **AWS CodePipeline** - Continuous integration and deployment pipeline to automate the deployment process.
- **AWS CodeBuild** - Automated build service to compile the Vue project and deploy it to the S3 bucket.

### Project Setup (Local Development)

1. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Run the Development Server**
    ```bash
    npm run serve
    ```

### Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
