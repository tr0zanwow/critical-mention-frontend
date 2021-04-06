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
          <img src="@/assets/pin.svg" alt="" class="chng-loc-wrapper--icon" />
          <p class="chng-loc-wrapper--label">Change Location</p>
        </div>
      </div>
      <div class="other-stastics-wrapper"></div>
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

        &--icon {
          height: 14px;
          width: 14px;
        }

        &--label {
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
    }
  }

  &__timeline {
    height: 100%;
    width: 100%;
    grid-area: 'timeline';
  }
}
</style>
