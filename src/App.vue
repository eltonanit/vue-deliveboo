<script>
import Header from "./components/layouts/Header.vue";
import Footer from "./components/layouts/Footer.vue";
import HomePage from "./components/pages/HomePage.vue";

import { store } from "./store";

export default {
  components: {
    Header,
    Footer,
    HomePage,
  },

  data() {
    return {
      store,
    };
  },
};
</script>

<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <HomePage />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@import "./styles/general.scss";

/* App layout */
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgb(0,204,188);
background: linear-gradient(0deg, rgba(0,204,188,1) 3%, rgba(255,128,1,1) 72%);
}

.main-content {
  flex-grow: 1;
  padding-top: 90px;
  padding-bottom: 60px;
  overflow-y: auto;
}
</style>
