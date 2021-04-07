<template>
  <div class="container">
    <div class="container__statistics">
      <div class="location-temp-wrapper">
        <img
          class="weather-icon"
          src="@/assets/weather/shower_rain.svg"
          alt=""
          srcset=""
        />
        <p class="weather-type">{{ weatherType }}</p>
        <p class="weather-location">{{ weatherLocation }}</p>
        <p class="current-temprature">{{ currentTemprature }}</p>
        <div class="chng-loc-wrapper">
          <img src="@/assets/pin.svg" alt="" class="chng-loc-wrapper__icon" />
          <p class="chng-loc-wrapper__label">Change Location</p>
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
      <div class="days-navigation-wrapper">
        <div class="label-icon-wrapper">
          <img src="@/assets/left-arrow.svg" alt="" class="icon" />
          <p class="day">{{ previousDayName }}</p>
        </div>
      </div>
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
    }
  },
  mounted() {
    this.activeItem = 0
  },
  computed: {
    weatherType() {
      return 'Fog'
    },
    weatherLocation() {
      return 'Mumbai City'
    },
    currentTemprature() {
      var temp = 28
      return temp.unitCelsius()
    },
    humidityPercent() {
      return '50 %'
    },
    airPressure() {
      return '1009.483 PS'
    },
    rainChancePercent() {
      return '0 %'
    },
    windSpeed() {
      return '1.4 km/h'
    },
    previousDayName() {
      return 'Thursday'
    },
  },
  methods: {
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
  grid-template-rows: 65% 35%;
  grid-template-columns: 1fr;

  &__statistics {
    height: 100%;
    width: 100%;
    grid-area: statistics;
    display: flex;
    justify-content: space-between;

    .location-temp-wrapper {
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
      }

      .chng-loc-wrapper {
        padding: 5px;
        padding-left: 5px;
        display: flex;
        width: fit-content;
        align-items: center;
        cursor: pointer;

        &__icon {
          height: 14px;
          width: 14px;
        }

        &__label {
          margin-left: 2px;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .other-stastics-wrapper {
      height: 100%;
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

    .days-navigation-wrapper {
      height: 20%;
      width: 100%;
      display: flex;
      align-items: center;
      user-select: none;

      .label-icon-wrapper {
        display: flex;
        align-items: center;
        height: fit-content;
        width: fit-content;
        margin-left: 50px;
        cursor: pointer;
        padding: 5px;

        .icon {
          height: 10px;
          width: 10px;
        }

        .day {
          height: fit-content;
          width: fit-content;
          margin-left: 5px;
          font-size: 15px;
          font-weight: 500;
        }
      }
    }

    .timeline-list-wrapper {
      height: 80%;
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
