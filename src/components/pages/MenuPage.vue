<script>
import axios from "axios";
import { store } from "../../store.js";

export default {
  props: ['restaurantId'],  // Riceve l'id del ristorante come prop
  data() {
    return {
      store,
      dishes: [],  // Array per memorizzare i dati dei piatti
      loading: false,
      error: null,
    };
  },
  methods: {
    fetchDishes() {
      this.loading = true;
      this.error = null;

      axios.get(`${store.baseUrl}/dishes?restaurant_id=${this.restaurantId}`).then((response) => {
          if (response.data.success) {
            this.dishes = response.data.data;
          } else {
            this.error = 'Errore nel recupero dei piatti.';
          }
        }).catch((error) => {
          this.error = 'Errore di connessione con il server.';
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.fetchDishes();  // Chiamata automatica quando il componente è montato
  }
};
</script>

<template>
  <div class="container py-4">
    <div class="row">
      <!-- Informazioni Ristorante -->
      <div class="col-12 mb-5">
        <router-link :to="{ name: 'Home' }" class="text_orange link-underline link-underline-opacity-0">
          <i class="fa-solid fa-arrow-left"></i> Indietro
        </router-link>
        <div class="card border-0 bg-transparent mb-3 mt-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="https://picsum.photos/420/250" class="img-fluid" alt="Restaurant image">
            </div>
            <div class="col-md-8 text-white">
              <div class="card-body">
                <h5 class="card-title text_orange">Nome Ristorante</h5>
                <p class="card-text m-0">Tipologie</p>
                <p class="card-text">Eventuali Informazioni</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Lista Piatti -->
      <div class="col-12 col-lg-9">
        <div class="row">
          <h2 class="text_orange">Lista Piatti</h2>
          <h3 v-if="loading" class="text-center text_orange">Caricamento...</h3>
          <h3 v-if="error" class="text-center text_orange">{{ error }}</h3>

          <div v-if="!loading & !error" v-for="dish in dishes" :key="dish.id" class="col-12 col-md-6 p-3">

            <div class="card border-0">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="https://picsum.photos/450/450" class="img-fluid" alt="dish_image">
                </div>
                <div class="col-md-8 p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="card-title">{{ dish.name }}</h5>
                    <p>{{ dish.description }}</p>
                    <p>{{ dish.price }} &#8364;</p>
                  </div>
                  <div class="">
                    <button class="btn py-5 btn_orange"><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="col-12 col-lg-3 text-white">
        Qui andrà il carrello
      </div>
    </div>
  </div>
  <!-- Prova del caricamento, lasciare commentato -->
  <!-- <div>
    <div v-if="loading">Caricamento...</div>
    <div v-if="error">{{ error }}</div>

    <div v-if="!loading && !error">
      <ul>
        <li v-for="dish in dishes" :key="dish.id">
          {{ dish.name }}
        </li>
      </ul>
    </div>
  </div> -->
</template>


<style lang="scss" scoped>
.text_orange {
  color: rgba(255,128,1,1);
}

.btn_orange {
  background-color: rgba(255,128,1,1);
  color: white;
  &:hover {
  background: rgb(77,20,140);
  }
}
</style>
