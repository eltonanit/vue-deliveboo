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
    <header>
      <Header />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<style lang="scss">
@import "./styles/general.scss";

/* App layout */
#app {
  

  header {
    background-color: rgb(77,20,140);
    border-bottom: 2px solid rgba(255,128,1,1);
  }

  main {
    background: linear-gradient(180deg, rgba(77,20,140,1) 48%, rgba(255,128,0,1) 100%);
  }

  footer {
    background-color: black;
    color: white;
  }
}
</style>
