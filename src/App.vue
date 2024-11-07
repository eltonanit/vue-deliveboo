<script>
import Header from './components/layouts/Header.vue';
import Footer from './components/layouts/Footer.vue';
import { store } from './store';


export default {

  components: {
    Header,
    Footer
  },

  data() {
    return {
      store,
    }
  },

}
</script>

<template>
  <div>
    <Header />
    <main>
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@import './styles/general.scss';
</style>

