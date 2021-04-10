import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Selected location weather current & hourly data
    selectedLocationWeatherData: {
      location: '',
      data: [],
    },

    //Selected location timezone
    selectedLocationTimezone: '',

    //Current user selected location data
    currentSelectedWeatherData: {},

    //Autosuggestion location list
    autoSuggestLocationList: [],
  },
  mutations: {
    setSelectedLocationWeatherData(state, payload) {
      state.selectedLocationWeatherData.data.push(payload)
    },
    setSelectedLocationWeatherDataSpecificIndex(state, payload) {
      state.selectedLocationWeatherData.data.splice(1, 0, payload)
    },
    resetSelectedLocationWeatherData(state) {
      state.selectedLocationWeatherData.data = []
    },
    setAutoSuggestLocationList(state, payload) {
      state.autoSuggestLocationList = payload
    },
    setCurrentLocation(state, payload) {
      state.selectedLocationWeatherData.location = payload
    },
    setCurrentSelectedWeatherData(state, payload) {
      state.currentSelectedWeatherData =
        state.selectedLocationWeatherData.data[payload.index]
    },
    setSelectedLocationTimezone(state, payload) {
      state.selectedLocationTimezone = payload
    },
  },
  getters: {
    getAutoSuggestLocationList(state) {
      return state.autoSuggestLocationList
    },
    getCurrentLocationDataList(state) {
      return state.selectedLocationWeatherData.data
    },
    getCurrentLocationName(state) {
      return state.selectedLocationWeatherData.location
    },
    getCurrentSelectedWeatherData(state) {
      return state.currentSelectedWeatherData
    },
    getWeatherIconUrl(state) {
      var id = state.currentSelectedWeatherData.weather_type_id
      var iconName = ''
      switch (true) {
        case id >= 200 && id <= 232: {
          iconName = 'thunder_storm'
          break
        }
        case id >= 300 && id <= 321: {
          iconName = 'shower_rain'
          break
        }
        case id >= 500 && id <= 531: {
          iconName = 'rain'
          break
        }
        case id >= 600 && id <= 622: {
          iconName = 'snow_storm'
          break
        }
        case id >= 701 && id <= 781: {
          iconName = 'mist'
          break
        }
        case id == 800: {
          iconName = 'clear_sun'
          break
        }
        case id >= 801 && id <= 804: {
          iconName = 'scattered_cloud'
          break
        }
      }

      return require(`../assets/weather/${iconName}.svg`)
    },
  },
  actions: {
    geolocateUserLocation(context) {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.log('Geolocation is not supported by your browser')
        } else {
          navigator.geolocation.getCurrentPosition(
            (success) => {
              console.log('inside success')
              let { longitude, latitude } = success.coords
              let coords = {
                lat: latitude,
                long: longitude,
              }

              // Reverse geocode to fetch location name based on coordinates
              const sParams = new URLSearchParams()
              sParams.append('access_token', process.env.VUE_APP_MAPBOX_TOKEN)
              sParams.append('autocomplete', true)
              axios
                .get(
                  `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.long},${coords.lat}.json`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    params: sParams,
                  }
                )
                .then((response) => {
                  console.log(response.data)
                  var data = response.data.features
                  data.map((item) => {
                    if (item.place_type[0] == 'place') {
                      context.commit('setCurrentLocation', item.text)
                    }
                  })
                })
                .catch((error) => {
                  if (error) {
                    console.log(error)
                  }
                })
              resolve(coords)
            },
            (error) => {
              console.log('inside error')
              console.log(error)
              //Return mumbai coordinates as default when geolocation fails or permission denied
              let coords = {
                lat: '19.076090',
                long: '72.877426',
              }
              context.commit('setCurrentLocation', 'Mumbai')
              resolve(coords)
            }
          )
        }
      })
    },
    locationInputAutoComplete(context, payload) {
      return new Promise((resolve, reject) => {
        // Mapbox geocoding api query parameters
        const sParams = new URLSearchParams()
        sParams.append('access_token', process.env.VUE_APP_MAPBOX_TOKEN)
        sParams.append('autocomplete', true)
        axios
          .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${payload.location}.json`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              params: sParams,
            }
          )
          .then((response) => {
            //Restructure Mapbox location list data to feed it to autosuggest
            var restructuredData = response.data.features.map((item) => {
              var country = ''
              if (item.context) {
                country = item.context[item.context.length - 1].text
              } else {
                country = item.text
              }
              return {
                location: item.text,
                country,
                coordinates: {
                  long: item.center[0],
                  lat: item.center[1],
                },
              }
            })

            context.commit('setAutoSuggestLocationList', restructuredData)

            resolve()
          })
          .catch((error) => {
            if (error) {
              reject()
            }
          })
      })
    },
    locationWeather(context, payload) {
      return new Promise((resolve, reject) => {
        //Reset selected location weather data before adding new data
        context.commit('resetSelectedLocationWeatherData')

        //Weather API query parameters
        const sParams = new URLSearchParams()
        sParams.append('lat', payload.lat)
        sParams.append('lon', payload.long)
        sParams.append('APPID', process.env.VUE_APP_OPENWEATHERAPI_APP_ID)
        sParams.append('units', 'metric')
        sParams.append('exclude', 'minutely,daily,alerts')
        axios
          .get('http://api.openweathermap.org/data/2.5/onecall', {
            headers: {
              'Content-Type': 'application/json',
            },
            params: sParams,
          })
          .then((response) => {
            //Save current selected location timezone
            context.commit(
              'setSelectedLocationTimezone',
              response.data.timezone
            )

            //Making use of bind function to reuse responseWeatherData object mapping
            var responseWeatherData = {
              data: function() {
                return {
                  date: this.dt,
                  feels_like: this.feels_like,
                  humidity: this.humidity,
                  pressure: this.pressure,
                  temprature: this.temp,
                  wind_speed: this.wind_speed,
                  weather_type: this.weather[0].main,
                  weather_type_id: this.weather[0].id,
                }
              },
            }

            //Add all hourly weather data to weather data state
            var hourlyData = response.data.hourly
            hourlyData.map((item) => {
              context.commit(
                'setSelectedLocationWeatherData',
                responseWeatherData.data.bind(item)()
              )
            })

            //Pushing current weather data to second index of array
            var currentData = response.data.current
            context.commit(
              'setSelectedLocationWeatherDataSpecificIndex',
              responseWeatherData.data.bind(currentData)()
            )
            resolve(context.state.selectedLocationWeatherData.data)
          })
          .catch((error) => {
            console.log(error)
            reject()
          })
      })
    },
  },
  modules: {},
  plugins: [
    new VuexPersistence({
      storage: window.localStorage,
      reducer: (state) => ({
        selectedLocationWeatherData: state.selectedLocationWeatherData,
        currentSelectedWeatherData: state.currentSelectedWeatherData,
        selectedLocationTimezone: state.selectedLocationTimezone,
      }),
    }).plugin,
  ],
})
