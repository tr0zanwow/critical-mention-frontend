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
    <div class="container__timeline"></div>
  </div>
</template>

<script>
export default {
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
    airPressure(){
        return '1009.483 PS'
    },
    rainChancePercent(){
        return '0 %'
    },
    windSpeed(){
        return '1.4 km/h'
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  background: linear-gradient(
      rgba(0, 130, 170, 0),
      rgba(0, 130, 170, 0),
      rgba(105, 170, 0, 0.349)
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
    grid-area: 'statistics';
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
    grid-area: 'timeline';
  }
}
</style>
