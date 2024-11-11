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
      cart: [],
      totalPrice: 0,
      ristoranteAttuale: null,
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
    addToCart(dish) {
      if (this.canAddToCart(dish)) {
        this.cart.push(dish);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.calculateTotalPrice();
      } else {
        alert('Puoi aggiungere piatti al carrello da un solo ristorante alla volta');
      }
    },
    canAddToCart(dish) {
    return this.cart.every(item => item.restaurant.id === dish.restaurant.id);
    },
    calculateTotalPrice() {
    this.totalPrice = this.cart.reduce((total, dish) => total + parseFloat(dish.price), 0);
    },
    removeFromCart(dishId) {
      const index = this.cart.findIndex(dish => dish.id === dishId);
      if (index > -1) {
        this.cart.splice(index, 1);
        this.calculateTotalPrice(); 
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },
  },
  mounted() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.calculateTotalPrice();
    };
    this.ristoranteAttuale = this.$route.params.restaurantId;
    this.fetchDishes(); 
  },
  computed: {
    restaurantName() {
      return this.dishes[0]?.restaurant?.name || '';
    },
    restaurantTypes() {
      return this.dishes[0]?.restaurant?.types || [];
    },
    restaurantAddress() {
      return this.dishes[0]?.restaurant?.address || '';
    },
    restaurantPhone() {
      return this.dishes[0]?.restaurant?.phone || '';
    },
    totalPrice() {
      return this.cart.reduce((total, dish) => total + parseFloat(dish.price), 0);
    },
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
            <div class="col-md-8 text-white text-capitalize">
              <div class="card-body">
                <h5 class="card-title text_orange">{{ restaurantName }}</h5>
                <ul>
                  <li v-for="type in restaurantTypes" :key="type.id">{{ type.name }}</li>
                </ul>
                <p class="card-text m-0">Indirizzo: <span class="text-capitalize">{{ restaurantAddress }}</span></p>
                <p class="card-text m-0">Numero: <a href="tel:{{ restaurantPhone }}">{{ restaurantPhone }}</a></p>
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
                    <h5 class="card-title text-uppercase">{{ dish.name }}</h5>
                    <p>{{ dish.description }}</p>
                    <p class="text-success">{{ dish.price }} &#8364;</p>
                  </div>
                  <div class="">
                    <button class="btn py-5 btn_orange" @click.prevent="addToCart(dish)"><i class="fa-solid fa-plus"></i></button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <!-- Carrello -->
      <div class="col-12 col-lg-3 text-white position-absolute top-15 end-0">
        <div class="card">
          <div class="card-header text-center text-uppercase">Carrello</div>
          <ul class="list-group list-group-flush" style="height: 486px; overflow-y: auto;">
            <li v-for="cartDish in cart" :key="cartDish.id" class="list-group-item d-flex justify-content-between align-items-center">
              <span class="flex-grow-1">{{ cartDish.name }}: <span class="text-success">{{ cartDish.price }} &euro;</span></span>
              <button class="btn btn-sm btn-danger" @click="removeFromCart(cartDish.id)"><i class="fas fa-trash-can"></i></button>
            </li>
          </ul>
          <div class="card-footer">Prezzo: <span class="text-success">{{ totalPrice }} &euro;</span></div>
        </div>
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
