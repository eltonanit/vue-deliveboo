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
    <main>
      <HomePage />

    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@import "./styles/general.scss";

/* App layout */
#app {
  background: rgb(77,20,140);
  background: linear-gradient(180deg, rgba(77,20,140,1) 48%, rgba(255,128,0,1) 100%);
}
</style>
