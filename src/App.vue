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
  background: rgb(77,20,140);
  background: linear-gradient(180deg, rgba(77,20,140,1) 48%, rgba(255,128,0,1) 100%); 
}

.main-content {
  flex-grow: 1;
  padding-top: 90px;
  padding-bottom: 60px;
  overflow-y: auto;
}
</style>
