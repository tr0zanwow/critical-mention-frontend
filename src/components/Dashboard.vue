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
        <p class="weather-type">{{ weatherType() }}</p>
        <p class="weather-location">{{ weatherLocation() }}</p>
        <p
          class="current-temprature"
          :title="currentTempratureTitle"
          @click="tempratureUnitToggle = !tempratureUnitToggle"
        >
          {{ currentTemprature() }}
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
              <p class="value">{{ humidityPercent() }}</p>
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
              <p class="value">{{ airPressure() }}</p>
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
              <p class="value">{{ rainChancePercent() }}</p>
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
              <p class="value">{{ windSpeed() }}</p>
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
            v-for="(item, index) in getTimelineList()"
            :key="item + index"
          >
            <div
              class="list-item-day"
              :class="{ 'list-item-day--show': dayName({}, index) }"
            >
              {{ dayName(item, index) }}
            </div>
            <div
              class="list-item-wrapper"
              @click="selectedItem(index)"
              :class="{
                'list-item-wrapper__item--active': index === activeItem,
              }"
            >
              <p class="time">{{ hourlyTime(item.date) }}</p>
              <p class="temprature">{{ hourlyTemprature(item.temprature) }}</p>
              <p class="feels-like-temp">
                Feels like {{ hourlyTemprature(item.feels_like) }}
              </p>
            </div>
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
    <div
      class="container__mobile-view"
      :class="{ 'container__mobile-view--search-bar-enable': showSearchBar }"
    >
      <div class="statistics-wrapper">
        <div class="time-location-wrapper">
          <p class="time">
            {{ currentTime }}<span class="ampm">{{ AMPM }}</span>
          </p>
          <div class="location-wrapper" @click="showSearchBarAndFocus()">
            <img src="@/assets/pin.svg" class="location-icon" alt="" />
            <p class="location-name">
              {{ weatherLocation() }}
              <span class="change-location-label">(Change)</span>
            </p>
          </div>
          <div class="location-input-wrapper">
            <img
              @click="backBtnMobile()"
              src="@/assets/left-arrow.svg"
              alt=""
              class="back-btn-icon"
            />
            <input
              @input="searchLocation"
              v-model="searchLocationInput"
              class="location-input"
              placeholder="Search for location (Press enter)"
              ref="locationInputMobile"
              type="text"
            />
            <img
              @click="geolocateUserLocation()"
              src="@/assets/geolocate.svg"
              alt=""
              class="geolocate-icon"
            />
          </div>
          <div
            class="location-input-result-wrapper"
            :class="{
              'location-input-result-wrapper--enable': showLocInputResult,
            }"
          >
            <div
              class="location-result-item"
              v-for="(item, index) in autoSuggestLocationList"
              :key="item.location + index"
              @click="getLocationWeather(item)"
            >
              <p class="location-result-item__location-name">
                &#8226; {{ item.location }}
              </p>
              <p class="location-result-item__location-country">
                {{ item.country }}
              </p>
            </div>
          </div>
        </div>
        <div class="temp-statistics-wrapper">
          <div class="current-temp-wrapper">
            <div class="weather-type-icon">
              <img
                class="weather-icon"
                :src="weatherIconUrl()"
                alt=""
                srcset=""
              />
              <p class="weather-type">Smoke</p>
            </div>
            <div
              class="temp-icon-wrapper"
              @click="tempratureUnitToggle = !tempratureUnitToggle"
            >
              <img src="@/assets/thermometer.svg" alt="" class="temp-icon" />
              <p class="temprature">{{ currentTemprature() }}</p>
            </div>
          </div>
          <div class="other-stats-wrapper">
            <div class="stats-wrapper">
              <img
                src="@/assets/weather/humidity.svg"
                alt=""
                class="stats-wrapper__icon"
              />
              <p class="stats-wrapper__value">{{ humidityPercent() }}</p>
              <p class="stats-wrapper__label">Humidity</p>
            </div>
            <div class="stats-wrapper">
              <img
                src="@/assets/weather/pressure.svg"
                alt=""
                class="stats-wrapper__icon"
              />
              <p class="stats-wrapper__value">{{ airPressure() }}</p>
              <p class="stats-wrapper__label">Pressure</p>
            </div>
            <div class="stats-wrapper">
              <img
                src="@/assets/weather/wind.svg"
                alt=""
                class="stats-wrapper__icon"
              />
              <p class="stats-wrapper__value">{{ windSpeed() }}</p>
              <p class="stats-wrapper__label">Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
      <div class="timeline-wrapper">
        <template v-for="(item, index) in getTimelineList()">
          <div
            class="timeline-wrapper__day"
            :key="index"
            :class="{ 'timeline-wrapper__day--show': dayName({}, index) }"
          >
            {{ dayName(item, index) }}
          </div>
          <div
            class="timeline-wrapper__item-wrapper"
            :key="item.date"
            @click="selectedItem(index)"
            :class="{
              'timeline-wrapper__item-wrapper--active': index === activeItem,
            }"
          >
            <p class="time">{{ hourlyTime(item.date) }}</p>
            <p class="temprature">{{ hourlyTemprature(item.temprature) }}</p>
            <p class="feels-like">
              Feels like {{ hourlyTemprature(item.feels_like) }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
export default {
  data() {
    return {
      activeItem: false,
      chngLocVisibilityDisable: false,
      showLocInputResult: false,
      tempratureUnitToggle: false,
      showSearchBar: false,
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

    setTimeout(() => {
      this.getCurrentTime()
    }, 1200)
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
  computed: {},
  methods: {
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
      return this.$store.getters.getCurrentSelectedWeatherData.temprature.getTempratureInUnit(
        { fahrenheit: this.tempratureUnitToggle }
      )
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
    backBtnMobile() {
      this.showSearchBar = false
      this.showLocInputResult = false
    },
    showSearchBarAndFocus() {
      this.showSearchBar = true
      this.searchLocationInput = ''
      this.$refs.locationInputMobile.focus()
    },
    dayName(item, index) {
      if (index == 0) {
        if (item) {
          return moment.unix(item.date).format('ddd Do MMM')
        } else {
          return true
        }
      } else {
        var currentDate = moment
          .unix(this.getTimelineList()[index].date)
          .format('D')
        var previousDate = moment
          .unix(this.getTimelineList()[index - 1].date)
          .format('D')
        if (currentDate != previousDate) {
          if (item) {
            return moment.unix(item.date).format('ddd Do MMM')
          } else {
            return true
          }
        }
      }
    },
    getTimelineList() {
      return this.$store.getters.getCurrentLocationDataList
    },
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
      return moment
        .unix(value)
        .tz(this.$store.state.selectedLocationTimezone)
        .format('h A')
    },
    hourlyTemprature(value) {
      return value.getTempratureInUnit({
        fahrenheit: this.tempratureUnitToggle,
      })
    },
    selectedItem(value) {
      this.activeItem = value
      this.$store.commit('setCurrentSelectedWeatherData', { index: value })
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
      var time = moment(new Date())
        .tz(this.$store.state.selectedLocationTimezone)
        .format('h:mm A')

      this.currentTime = time.split(' ')[0]
      this.AMPM = time.split(' ')[1]
    },
    geolocateUserLocation() {
      this.$store.dispatch('geolocateUserLocation').then((response) => {
        this.$store.dispatch('locationWeather', response).then(() => {
          this.$store.commit('setCurrentSelectedWeatherData', { index: 1 })
          this.chngLocVisibilityDisable = false
          this.backBtnMobile()
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
        this.showSearchBar = false
        this.showLocInputResult = false
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
  grid-template-rows: 67% 33%;
  grid-template-columns: 1fr;

  @include sm {
    display: flex;
  }

  &__statistics {
    height: 100%;
    width: 100%;
    grid-area: statistics;
    display: flex;
    justify-content: space-between;

    @include sm {
      display: none;
    }

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

    @include sm {
      display: none;
    }

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
          min-width: 150px;
          height: 100%;
          margin-left: 8px;
          margin-right: 8px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;

          .list-item-day {
            margin-left: 2px;
            font-size: 14px;
            font-weight: 600;
            min-height: 20px;
            opacity: 0;

            &--show {
              opacity: 1;
            }
          }

          .list-item-wrapper {
            margin-top: 8px;
            align-self: center;
            width: 100%;
            height: calc(100% - 38px);
            background: transparent;
            box-sizing: border-box;
            overflow: hidden;
            transition: all 0.25s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            padding: 30px 16px;
            justify-content: space-around;

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

            &__item--active {
              @include timeline-list-item__selected;
            }
          }

          &:first-child {
            margin-left: 45px;
          }
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

  &__mobile-view {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-areas:
      'statistics-mobile'
      'timeline-mobile';
    grid-template-rows: 65% 35%;
    grid-template-columns: 1fr;
    user-select: none;

    .statistics-wrapper {
      height: 100%;
      width: 100%;
      grid-area: statistics-mobile;
      display: flex;
      flex-direction: column;

      .time-location-wrapper {
        height: fit-content;
        padding: 20px;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .time {
          margin-left: 24px;
          font-size: 3.5rem;
          font-weight: 700;
          transition: margin-top 0.2s linear, opacity 0.2s linear;

          .ampm {
            margin-left: 5px;
            font-size: 13px;
            font-weight: 400;
          }
        }

        .location-wrapper {
          transition: all 0.25s linear;
          display: flex;
          width: fit-content;
          height: fit-content;
          align-items: center;
          margin-top: -6px;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

          .location-icon {
            height: 1.2rem;
            width: 1.2rem;
          }

          .location-name {
            font-size: 16px;
            margin-left: 4px;
            cursor: pointer;

            .change-location-label {
              font-size: 12px;
            }
          }
        }

        .location-input-wrapper {
          position: sticky;
          top: 0;
          height: 0px;
          opacity: 0;
          width: calc(100% - 50%);
          transition: height 0.2s linear, width 0.2s linear, margin 0.2s linear,
            opacity 0.2s linear;
          margin-bottom: 50px;
          border-radius: 3px;
          display: flex;
          align-items: center;

          .back-btn-icon {
            height: 16px;
            width: 16px;
            margin-left: 10px;
            padding: 3px;
            cursor: pointer;
          }

          .location-input {
            width: 100%;
            height: 100%;
            outline: none;
            border: none;
            font-size: 16px;
            color: white;
            background: transparent;
            margin-left: 8px;

            &::-webkit-input-placeholder {
              color: rgba(255, 255, 255, 0.616);
            }
          }

          .geolocate-icon {
            height: 22px;
            width: 22px;
            margin-right: 8px;
            padding: 3px;
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
          }
        }

        .location-input-result-wrapper {
          margin-bottom: -50px;
          opacity: 0;
          width: calc(100% + 20px);
          height: 0px;
          backdrop-filter: blur(5px);
          transition: all 0.2s linear;

          .location-result-item {
            margin: 8px;
            &__location-name {
              font-size: 14px;
              font-weight: 500;
            }

            &__location-country {
              font-size: 11px;
              margin-left: 10px;
            }
          }

          &--enable {
            margin-top: 8px;
            height: 145px;
            overflow: auto;
            opacity: 1;
            margin-bottom: 0px;
          }
        }
      }

      .temp-statistics-wrapper {
        height: 100%;
        box-sizing: border-box;
        width: 100%;
        padding: 18px 12px;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;

        .current-temp-wrapper {
          display: flex;
          height: fit-content;
          align-items: center;
          justify-content: space-evenly;
          width: 100%;
          box-sizing: border-box;
          padding: 5px 8px;
          backdrop-filter: blur(3px);
          transition: backdrop-filter 0.2s linear;

          .weather-type-icon {
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: margin-left 0.2s linear, opacity 0.2s linear;

            .weather-icon {
              height: 2.2rem;
              width: 2.2rem;
            }

            .weather-type {
              font-size: 20px;
            }
          }

          .temp-icon-wrapper {
            display: flex;
            align-items: center;
            width: fit-content;
            height: fit-content;
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
            transition: margin-right 0.2s linear, opacity 0.2s linear;

            .temp-icon {
              height: 2rem;
              width: 2rem;
            }

            .temprature {
              font-size: 45px;
              font-weight: 600;
            }
          }
        }

        .other-stats-wrapper {
          margin-top: 28px;
          height: fit-content;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          box-sizing: border-box;
          padding: 8px;
          flex-wrap: wrap;
          backdrop-filter: blur(3px);
          transition: backdrop-filter 0.2s linear;

          .stats-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: margin 0.2s linear, opacity 0.2s linear;

            &__icon {
              height: 1.6rem;
              widows: 1.6rem;
            }

            &__value {
              margin-top: 6px;
              font-size: 16px;
              font-weight: 600;
            }

            &__label {
              margin-top: -4px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .timeline-wrapper {
      height: 100%;
      width: calc(100%);
      overflow-x: auto;
      overflow-y: hidden;
      grid-area: timeline-mobile;
      padding: 8px 5px;
      box-sizing: border-box;
      display: flex;
      transition: margin 0.2s linear, opacity 0.2s linear;

      &__day {
        height: 30px;
        min-width: 150px;
        padding: 5px;
        box-sizing: border-box;
        opacity: 0;
        font-size: 13.5px;
        backdrop-filter: blur(3px);

        &:first-child {
          margin-left: 10px;
        }

        &:last-child {
          margin-right: 25px;
        }

        &--show {
          opacity: 1;
        }
      }

      &__item-wrapper {
        height: calc(100% - 40px);
        align-self: center;
        min-width: 150px;
        margin-left: -150px;
        margin-right: 12px;
        padding: 5px;
        margin-top: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        transition: all 0.15s linear;

        &:first-child {
          margin-left: -140px;
        }

        &:last-child {
          margin-right: 25px;
        }

        .time {
          margin-top: 30px;
          font-size: 14px;
          transition: all 0.15s linear;
        }

        .temprature {
          margin-top: -30px;
          font-size: 38px;
          font-weight: 600;
          transition: all 0.15s linear;
        }

        .feels-like {
          font-size: 15px;
          opacity: 0;
          margin-bottom: -30px;
          transition: all 0.15s linear;
        }

        &--active {
          justify-content: space-evenly;
          box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3),
            0 15px 12px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(1px);

          .time {
            margin-top: 0px;
          }

          .temprature {
            margin-top: 0px;
            font-size: 45px;
          }

          .feels-like {
            opacity: 1;
            margin-bottom: 0px;
          }
        }
      }
    }

    &--search-bar-enable {
      .statistics-wrapper {
        .time-location-wrapper {
          .time {
            margin-top: -85px;
            opacity: 0;
          }

          .location-wrapper {
            margin-top: -50px;
          }

          .location-input-wrapper {
            height: 42px;
            opacity: 1;
            width: calc(100% + 20px);
            margin-bottom: 0;
            border: 1px solid rgba(255, 255, 255, 0.527);
            margin-top: 12px;
            backdrop-filter: blur(5px);
          }
        }
        .temp-statistics-wrapper {
          .current-temp-wrapper {
            backdrop-filter: blur(0px);

            .weather-type-icon {
              margin-left: -650px;
              opacity: 0;
            }

            .temp-icon-wrapper {
              margin-right: -650px;
              opacity: 0;
            }
          }

          .other-stats-wrapper {
            backdrop-filter: blur(0px);

            .stats-wrapper {
              &:nth-child(1) {
                opacity: 0;
                margin-left: -650px;
              }
              &:nth-child(2) {
                opacity: 0;
                margin-bottom: -250px;
              }
              &:nth-child(3) {
                opacity: 0;
                margin-right: -650px;
              }
            }
          }
        }
      }
      .timeline-wrapper {
        opacity: 0;
        margin-top: 250px;
      }
    }
  }
}
</style>
