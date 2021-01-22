<template>
  <v-container>
    <div id="shot">
      <img :src="shotUrl" alt="" ondragstart="return false" />
      <!-- <p v-text="gameName.replace(/(?<=<)(.*?)(?=\s*>)/gi, '')"></p>
      <p>{{ date }}</p>
      <p>Score : {{ score }}</p>
      <div id="author">
        <img :src="authorsAvatarUrl" alt="avatar" ondragstart="return false" />
        <span>{{ author }}</span>
      </div> -->
      <v-card width="50vw" style="left: 25vw; top: 10px" dark elevation="2">
        <v-card-title>
          <v-avatar>
            <img :src="authorsAvatarUrl" />
          </v-avatar>
          <span style="padding-left: 10px">{{ author }}</span>
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon>
        </v-card-title>
        <v-card-subtitle>
          <span
            v-if="gameName != undefined"
            v-text="gameName.replace(/(?<=<)(.*?)(?=\s*>)/gi, '')"
          ></span>
        </v-card-subtitle>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "show-shot",
  props: {
    author: String,
    authorsAvatarUrl: String,
    date: String,
    gameName: String,
    score: Number,
    shotUrl: String,
  },
  data: () => ({}),
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
div#shot {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: #212121aa;
  animation: fadeIn 1000ms forwards;
}

div#shot > img {
  padding-top: 10px;
  max-width: 90vw;
  max-height: 80vh;
  margin: auto auto;
}

div#shot div#author {
  display: flex;
}

div#shot div#author img {
  border-radius: 50%;
  max-width: 80px;
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