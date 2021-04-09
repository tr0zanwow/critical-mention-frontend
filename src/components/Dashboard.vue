<template>
  <div class="container">
    <div class="container__statistics">
      <div class="current-time">
        <div>
          {{ currentTime }}<span>{{ AMPM }}</span>
        </div>
        <div>
          <img src="@/assets/information.svg" alt="information" />
          <span>Showing time for current selected location</span>
        </div>
      </div>
      <div class="location-temp-wrapper">
        <img class="weather-icon" :src="weatherIconUrl()" alt="" srcset="" />
        <p class="weather-type">{{ weatherType }}</p>
        <p class="weather-location">{{ weatherLocation }}</p>
        <p
          class="current-temprature"
          :title="currentTempratureTitle"
          @click="tempratureUnitToggle = !tempratureUnitToggle"
        >
          {{ currentTemprature }}
        </p>
        <div
          class="chng-loc-wrapper"
          :class="{ 'chng-loc-wrapper--disable': chngLocVisibilityDisable }"
          @click="chngLocVisibility()"
        >
          <img src="@/assets/pin.svg" alt="" class="chng-loc-wrapper__icon" />
          <p class="chng-loc-wrapper__label">Change Location</p>
        </div>
        <div
          class="chng-loc-input-wrapper"
          :class="{
            'chng-loc-input-wrapper--enable': chngLocVisibilityDisable,
          }"
        >
          <img
            src="@/assets/pin.svg"
            alt=""
            class="chng-loc-input-wrapper__icon"
          />
          <div class="chng-loc-input-wrapper__input-and-result-wrapper">
            <div class="input-wrapper">
              <input
                placeholder="Search for location"
                class="location-input"
                type="text"
                v-model="searchLocationInput"
                @input="searchLocation"
              />
              <img
                src="@/assets/geolocate.svg"
                class="geolocate-icon"
                alt="geolocate icon"
                @click="geolocateUserLocation()"
                title="Get current location"
              />
              <img
                src="@/assets/close.svg"
                title="Close"
                class="close-icon"
                @click="chngLocVisibility()"
                alt="close icon"
              />
            </div>
            <div
              class="loc-input-result-wrapper"
              :class="{
                'loc-input-result-wrapper--enable': showLocInputResult,
              }"
            >
              <div
                class="loc-result-item"
                v-for="(item, index) in autoSuggestLocationList"
                :key="item.location + index"
                @click="getLocationWeather(item)"
              >
                <p class="loc-result-item__loc-name">
                  &#8226; {{ item.location }}
                </p>
                <p class="loc-result-item__loc-country">{{ item.country }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="other-stastics-wrapper">
        <div class="right-panel">
          <div class="stats-wrapper">
            <img
              src="@/assets/weather/humidity.svg"
              alt=""
              class="stats-wrapper__icon"
            />
            <div class="label-value-wrapper">
              <p class="label">Humidity</p>
              <p class="value">{{ humidityPercent }}</p>
            </div>
          </div>
          <div class="stats-wrapper">
            <img
              src="@/assets/weather/pressure.svg"
              alt=""
              class="stats-wrapper__icon"
            />
            <div class="label-value-wrapper">
              <p class="label">Air Pressure</p>
              <p class="value">{{ airPressure }}</p>
            </div>
          </div>
          <div class="stats-wrapper">
            <img
              src="@/assets/weather/shower_rain.svg"
              alt=""
              class="stats-wrapper__icon"
            />
            <div class="label-value-wrapper">
              <p class="label">Chance of Rain</p>
              <p class="value">{{ rainChancePercent }}</p>
            </div>
          </div>
          <div class="stats-wrapper">
            <img
              src="@/assets/weather/wind.svg"
              alt=""
              class="stats-wrapper__icon"
            />
            <div class="label-value-wrapper">
              <p class="label">Wind Speed</p>
              <p class="value">{{ windSpeed }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container__timeline">
      <div class="timeline-list-wrapper">
        <div class="timeline-list" ref="timelineList">
          <div
            class="timeline-list__item"
            v-for="(item, index) in 24"
            :key="item + index"
            @click="selectedItem(index)"
            :class="{ 'timeline-list__item--active': index === activeItem }"
          >
            <p class="time">{{ hourlyTime(index) }}</p>
            <p class="temprature">{{ hourlyTemprature() }}</p>
            <p class="feels-like-temp">Feels like {{ hourlyTemprature() }}</p>
          </div>
        </div>
        <div class="timeline-navigation">
          <div
            class="nav-controller-wrapper"
            @click="navScrollController('left')"
          >
            <img src="@/assets/left-arrow.svg" alt="" class="icon left" />
          </div>
          <div
            class="nav-controller-wrapper"
            @click="navScrollController('right')"
          >
            <img src="@/assets/left-arrow.svg" alt="" class="icon right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: false,
      chngLocVisibilityDisable: false,
      showLocInputResult: false,
      tempratureUnitToggle: false,
      timer: {},
      searchLocationInput: '',
      currentTime: '',
      AMPM: '',
      currentTempratureTitle: '',
    }
  },
  created() {
    if (
      Object.keys(this.$store.getters.getCurrentSelectedWeatherData).length ===
      0
    ) {
      this.$store.dispatch('geolocateUserLocation').then((response) => {
        this.$store.dispatch('locationWeather', response).then(() => {
          this.$store.commit('setCurrentSelectedWeatherData', { index: 1 })
        })
      })
    }
  },
  mounted() {
    this.activeItem = 0

    this.getCurrentTime()
    setInterval(
      function() {
        this.getCurrentTime()
      }.bind(this),
      1000
    )
  },
  watch: {
    tempratureUnitToggle: function(val) {
      if (val) {
        this.currentTempratureTitle = 'Convert to ° Fahrenheit'
      } else {
        this.currentTempratureTitle = 'Convert to ° Celsius'
      }
    },
  },
  computed: {
    autoSuggestLocationList() {
      return this.$store.getters.getAutoSuggestLocationList
    },
    weatherType() {
      return this.$store.getters.getCurrentSelectedWeatherData.weather_type
    },
    weatherLocation() {
      return this.$store.getters.getCurrentLocationName
    },
    currentTemprature() {
      if (this.tempratureUnitToggle) {
        return this.$store.getters.getCurrentSelectedWeatherData.temprature.unitFahrenheit()
      } else {
        return this.$store.getters.getCurrentSelectedWeatherData.temprature.unitCelsius()
      }
    },
    humidityPercent() {
      return this.$store.getters.getCurrentSelectedWeatherData.humidity + ' %'
    },
    airPressure() {
      return this.$store.getters.getCurrentSelectedWeatherData.pressure + ' PS'
    },
    rainChancePercent() {
      return '0 %'
    },
    windSpeed() {
      return (
        (
          this.$store.getters.getCurrentSelectedWeatherData.wind_speed * 3.6
        ).toFixed(1) + ' km/h'
      )
    },
  },
  methods: {
    weatherIconUrl() {
      if (
        Object.keys(this.$store.getters.getCurrentSelectedWeatherData).length !=
        0
      ) {
        return this.$store.getters.getWeatherIconUrl
      } else {
        return require(`../assets/weather/rain.svg`)
      }
    },
    chngLocVisibility() {
      this.chngLocVisibilityDisable = !this.chngLocVisibilityDisable
      this.searchLocationInput = ''
      this.showLocInputResult = false
    },
    navScrollController(direction) {
      if (direction === 'left') {
        this.$refs.timelineList.scrollTo({
          left: this.$refs.timelineList.scrollLeft - 160,
          behavior: 'smooth',
        })
      } else if (direction === 'right') {
        this.$refs.timelineList.scrollTo({
          left: this.$refs.timelineList.scrollLeft + 160,
          behavior: 'smooth',
        })
      }
    },
    hourlyTime(value) {
      return value + ' PM'
    },
    hourlyTemprature() {
      var temp = 28
      return temp.unitCelsius()
    },
    selectedItem(value) {
      this.activeItem = value
    },
    searchLocation() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      var vm = this
      this.timer = setTimeout(function() {
        vm.searchLocationInput == ''
          ? (vm.showLocInputResult = false)
          : (vm.showLocInputResult = true)
        vm.$store.dispatch('locationInputAutoComplete', {
          location: vm.searchLocationInput,
        })
      }, 200)
    },
    getCurrentTime() {
      const currentTime = new Date()
      const hoursAMPM = currentTime
        .toLocaleString('en-US', {
          hour: 'numeric',
          hour12: true,
        })
        .split(' ')
      const hours = ('0' + hoursAMPM[0]).slice(-2)
      this.AMPM = hoursAMPM[1]
      const minutes = (
        '0' + currentTime.toLocaleString('en-US', { minute: 'numeric' })
      ).slice(-2)
      this.currentTime = hours + ':' + minutes
    },
    geolocateUserLocation() {
      this.$store.dispatch('geolocateUserLocation').then((response) => {
        this.$store.dispatch('locationWeather', response).then(() => {
          this.$store.commit('setCurrentSelectedWeatherData', { index: 1 })
          this.chngLocVisibilityDisable = false
        })
      })
    },
    getLocationWeather(payload) {
      this.searchLocationInput = payload.location + ', ' + payload.country
      this.showLocInputResult = false

      this.$store.dispatch('locationWeather', payload.coordinates).then(() => {
        this.$store.commit('setCurrentLocation', payload.location)
        this.$store.commit('setCurrentSelectedWeatherData', { index: 1 })
        this.chngLocVisibilityDisable = false
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin timeline-list-item__selected {
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  justify-content: space-between;
  padding: 18px 16px;

  .feels-like-temp {
    visibility: visible;
    opacity: 1;
    height: auto;
    margin-bottom: 0;
  }

  .temprature {
    font-size: 40px;
  }
}

.container {
  height: 100%;
  width: 100%;
  background: linear-gradient(
      rgba(0, 130, 170, 0),
      rgba(79, 82, 76, 0.178),
      rgba(49, 49, 48, 0.616)
    ),
    url('~@/assets/background.webp');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: grid;
  grid-template-areas:
    'statistics'
    'timeline';
  grid-template-rows: 70% 30%;
  grid-template-columns: 1fr;

  &__statistics {
    height: 100%;
    width: 100%;
    grid-area: statistics;
    display: flex;
    justify-content: space-between;

    .current-time {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 42%;
      top: 12%;

      div {
        font-size: 70px;
        font-weight: 600;
        user-select: none;
        display: flex;
        flex-direction: column;
        text-align: center;

        &:first-child {
          span {
            font-size: 18px;
            margin-top: -15px;
          }
        }

        &:nth-child(2) {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;
          width: fit-content;

          img {
            height: 14px;
            width: 14px;
            margin-left: -5px;
          }

          span {
            margin-left: -6px;
            font-size: 11px;
            font-weight: 400;
            height: fit-content;
            color: rgba(255, 255, 255, 0.747);
            width: 70%;
          }
        }
      }
    }

    .location-temp-wrapper {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 50px;
      padding-top: 40px;
      user-select: none;

      .weather-icon {
        height: 70px;
        width: 70px;
      }

      .weather-type {
        padding-left: 5px;
        font-size: 34px;
        margin-top: -2px;
      }

      .weather-location {
        padding-left: 5px;
        margin-top: -3px;
      }

      .current-temprature {
        padding-left: 5px;
        margin-top: 10px;
        font-size: 50px;
        font-weight: 700;
        width: fit-content;
        cursor: pointer;
      }

      .chng-loc-wrapper {
        padding: 5px;
        padding-left: 5px;
        display: flex;
        width: fit-content;
        height: fit-content;
        align-items: center;
        cursor: pointer;
        transition: all 0.25s linear;
        visibility: visible;
        opacity: 1;

        &__icon {
          margin-top: -2px;
          height: 14px;
          width: 14px;
        }

        &__label {
          margin-left: 2px;
          font-size: 14px;
          font-weight: 500;
          height: fit-content;
        }
      }

      .chng-loc-wrapper--disable {
        visibility: hidden;
        opacity: 0;
        margin-top: -30px;
      }

      .chng-loc-input-wrapper {
        padding: 5px;
        padding-left: 5px;
        display: flex;
        width: fit-content;
        height: fit-content;
        align-items: flex-start;
        transition: all 0.25s linear;
        visibility: hidden;
        opacity: 0;

        &__icon {
          margin-top: 6px;
          height: 14px;
          width: 14px;
        }
        &__input-and-result-wrapper {
          .input-wrapper {
            border: 1px solid rgba(255, 255, 255, 0.411);
            padding: 4px 6px;
            margin-left: 4px;
            display: flex;
            align-items: center;

            .location-input {
              background: transparent;
              color: white;
              border: none;
              outline: 0;
              min-width: 150px;
              font-size: 14px;

              &::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 0.644);
              }
            }

            .geolocate-icon {
              height: 15px;
              width: 15px;
              user-select: none;
              margin-left: 3px;
              cursor: pointer;
            }

            .close-icon {
              height: 11px;
              width: 11px;
              user-select: none;
              margin-left: 8px;
              cursor: pointer;
            }
          }

          .loc-input-result-wrapper {
            max-height: 130px;
            height: 0px;
            padding: 5px 8px;
            background: transparent;
            backdrop-filter: blur(10px);
            width: calc(100% - 3px);
            margin-left: 3px;
            box-sizing: border-box;
            overflow-y: auto;
            opacity: 0;
            transition: all 0.2s linear;

            .loc-result-item {
              display: none;
              flex-direction: column;
              cursor: pointer;
              box-sizing: border-box;
              padding: 1px 4px;
              margin-left: -7px;

              &__loc-name {
                font-size: 13px;
                color: white;
                width: fit-content;
                max-width: 150px;
              }

              &__loc-country {
                font-size: 10px;
                color: white;
                margin-left: 9px;
              }

              &:not(:first-child) {
                margin-top: 5px;
              }

              &:hover {
                background: rgba(255, 255, 255, 0.065);
              }
            }

            &::-webkit-scrollbar {
              width: 7px;
              height: 12px;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 8px;
              background: #bcbab78a;
              min-height: 40px;
            }

            &::-webkit-scrollbar-track {
              background: transparent;
            }

            &--enable {
              height: fit-content;
              opacity: 1;

              .loc-result-item {
                display: flex;
              }
            }
          }
        }
      }

      .chng-loc-input-wrapper--enable {
        visibility: visible;
        opacity: 1;
      }
    }

    .other-stastics-wrapper {
      height: 100%;
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      padding-right: 30px;
      padding-top: 40px;
      display: flex;
      justify-content: flex-end;

      .right-panel {
        width: fit-content;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;

        .stats-wrapper {
          display: flex;
          height: fit-content;
          width: fit-content;
          user-select: none;

          &:not(:first-child) {
            margin-top: 18px;
          }

          &__icon {
            width: 23px;
            height: 23px;
            margin-top: 6px;
          }

          .label-value-wrapper {
            display: flex;
            flex-direction: column;
            margin-left: 12px;

            .label {
              font-size: 14px;
            }

            .value {
              font-size: 26px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  &__timeline {
    height: 100%;
    width: 100%;
    grid-area: timeline;
    display: flex;
    flex-direction: column;

    .timeline-list-wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      user-select: none;

      .timeline-list {
        height: 100%;
        width: calc(100vw - 200px);
        display: flex;
        overflow: auto;
        flex: 1 calc(100vw - 200px);
        margin-left: 10px;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        &__item {
          align-self: center;
          min-width: 150px;
          height: calc(100% - 20px);
          background: transparent;
          margin-left: 8px;
          margin-right: 8px;
          box-sizing: border-box;
          overflow: hidden;
          transition: all 0.25s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          padding: 30px 16px;
          justify-content: space-around;

          &:first-child {
            margin-left: 45px;
          }

          &:hover {
            @include timeline-list-item__selected;
          }

          .time {
            font-size: 15px;
            transition: all 0.15s linear;
          }

          .temprature {
            font-size: 30px;
            font-weight: 700;
            transition: font-size 0.15s linear;
          }

          .feels-like-temp {
            font-size: 14px;
            visibility: hidden;
            opacity: 0;
            height: 0;
            margin-bottom: -25px;
            transition: visibility 0.15s, opacity 0.15s, height 0.15s,
              margin-bottom 0.15s linear;
          }
        }

        &__item--active {
          @include timeline-list-item__selected;
        }
      }

      .timeline-navigation {
        height: 100%;
        width: 100%;
        flex: 1 200px;
        display: flex;
        align-items: center;
        justify-content: center;

        .nav-controller-wrapper {
          height: 35px;
          width: 35px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          margin-left: 6px;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          user-select: none;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .icon {
            height: 13px;
            width: 13px;
          }

          .right {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>
