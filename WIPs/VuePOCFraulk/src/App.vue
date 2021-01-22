<template>
  <v-app id="app">
    <div>
      <div class="jg">
        <a
          id="imgCtn"
          v-for="(shot, i) in shots._default"
          :key="i"
          :style="`--w: ${shot.width / 4.8}; --h: ${
            shot.height / 4.8
          }; position: relative`"
          @click="
            isShown = true;
            selectedShot = shot;
          "
        >
          <img
            :src="shot.thumbnailUrl"
            :alt="shot.gameName"
            height="300"
            ondragstart="return false"
          />
          <div class="onImgHover" :style="`height: 4rem;`">
            <span
              v-text="shot.gameName.replace(/(?<=<)(.*?)(?=\s*>)/gi, '')"
            ></span>
          </div>
        </a>
      </div>
    </div>
    <ShowShot
      v-show="isShown && selectedShot != undefined"
      :author="selectedShot.author"
      :authorsAvatarUrl="selectedShot.authorsAvatarUrl"
      :date="selectedShot.date"
      :gameName="selectedShot.gameName"
      :score="selectedShot.score"
      :shotUrl="selectedShot.shotUrl"
      v-on:close="isShown = false"
    ></ShowShot>
  </v-app>
</template>

<script>
import ShowShot from "@/components/ShowShot";

export default {
  name: "App",
  data: () => ({
    shots: "",
    chunkShots: [],
    isShown: false,
    selectedShot: "",
  }),
  mounted() {
    this.$axios
      .get(
        "https://raw.githubusercontent.com/originalnicodrgitbot/test-git-python/main/shotsdb.json"
      )
      .then((response) => {
        this.shots = response.data;
        // not needed thanks to thumbnail
        // Object.entries(this.shots._default).forEach((x, y, z) =>
        //   !(y % 50) ? this.chunkShots.push(z.slice(y, y + 50)) : ""
        // );
        console.log(this.shots);
        console.log(this.chunkShots);
      });
  },
  components: {
    ShowShot,
  },
};
</script>

<style scoped>
.jg {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.jg > a,
.jg::after {
  --ratio: calc(var(--w) / var(--h));
  --row-height: 15rem;
  flex-basis: calc(var(--ratio) * var(--row-height));
}

.jg > a {
  margin: 0.25rem;
  flex-grow: calc(var(--ratio) * 100);
}

.jg::after {
  --w: 2;
  --h: 1;
  content: "";
  flex-grow: 1000000;
}

.jg > a > img {
  display: block;
  position: relative;
  width: 100%;
  opacity: 0;
  object-fit: cover;
  animation: fadeIn 1000ms forwards;
}

a {
  text-decoration: none;
  color: #fff !important;
}

.onImgHover {
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: -moz-linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  opacity: 0;
  z-index: 1;
  transform: translateY(-4rem);
  transition: 200ms;
}

a {
  text-decoration: none;
  color: #fff;
}

img:hover ~ .onImgHover,
.onImgHover:hover {
  opacity: 1;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
