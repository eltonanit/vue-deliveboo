<script>
import axios from "axios";
import { store } from "../../store.js";

export default {
  props: ["restaurantId"], // Riceve l'id del ristorante come prop
  data() {
    return {
      store,
      dishes: [], // Array per memorizzare i dati dei piatti
      loading: false,
      error: null,
      cart: [],
      ristoranteAttuale: null,
    };
  },
  methods: {
    // Recupero dei piatti del ristorante
    fetchDishes() {
      this.loading = true;
      this.error = null;

      axios.get(`${this.store.baseUrl}/dishes?restaurant_id=${this.restaurantId}`)
        .then((response) => {
          if (response.data.success) {
            // Assicurati che il prezzo di ogni piatto sia un numero
            this.dishes = response.data.data.map(dish => ({
              ...dish,
              price: parseFloat(dish.price) // Converte il prezzo in numero
            }));
          } else {
            this.error = "Errore nel recupero dei piatti.";
          }
        })
        .catch((error) => {
          this.error = "Errore di connessione con il server.";
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Aggiunta piatto al carrello con gestione della quantità
    addToCart(dish) {
      const existingDish = this.cart.find(item => item.id === dish.id);

      if (existingDish) {
        existingDish.quantity += 1; // Incrementa la quantità
      } else {
        // Aggiunge il piatto al carrello con il prezzo convertito in numero
        this.cart.push({
          ...dish,
          price: parseFloat(dish.price), // Converte il prezzo in numero
          quantity: 1
        });
      }
      this.saveCartToLocalStorage();
    },

    // Verifica se si può aggiungere il piatto al carrello
    canAddToCart(dish) {
      return this.cart.length === 0 || this.cart[0]?.restaurant?.id === dish.restaurant.id;
    },

    // Rimozione piatto dal carrello (con gestione della quantità)
    removeFromCart(dishId) {
      const index = this.cart.findIndex((dish) => dish.id === dishId);
      if (index !== -1) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity -= 1; // Decrementa la quantità
        } else {
          this.cart.splice(index, 1); // Rimuove il piatto se la quantità è 1
        }
        this.saveCartToLocalStorage();
      }
    },

    // Salvataggio del carrello nel localStorage
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Caricamento del carrello dal localStorage
    loadCartFromLocalStorage() {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
      }
    },
  },
  mounted() {
    this.loadCartFromLocalStorage(); // Caricamento del carrello
    this.ristoranteAttuale = this.$route.params.restaurantId; // Recupero dell'ID del ristorante
    this.fetchDishes(); // Caricamento dei piatti
  },
  computed: {
    // Nome del ristorante
    restaurantName() {
      return this.dishes[0]?.restaurant?.name || "Ristorante";
    },

    // Tipologie del ristorante
    restaurantTypes() {
      return this.dishes[0]?.restaurant?.types || [];
    },

    // Indirizzo del ristorante
    restaurantAddress() {
      return this.dishes[0]?.restaurant?.address || "Indirizzo non disponibile";
    },

    // Numero di telefono del ristorante
    restaurantPhone() {
      return this.dishes[0]?.restaurant?.phone || "Numero non disponibile";
    },

    // Calcolo del prezzo totale
    totalPrice() {
      return this.cart
        .reduce((total, dish) => total + parseFloat(dish.price || 0) * dish.quantity, 0)
        .toFixed(2); // Formattato con due decimali
    },

    // Calcolo del numero totale di piatti nel carrello
    totalQuantity() {
      return this.cart.reduce((total, dish) => total + dish.quantity, 0);
    }
  },
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
          <div class="row g-0 align-items-center">
            <div class="col-md-4">
              <img src="https://picsum.photos/420/250" class="img-fluid rounded" alt="Restaurant image" />
            </div>
            <div class="col-md-8 text-white text-capitalize">
              <div class="card-body">
                <h5 class="card-title text_orange">{{ restaurantName }}</h5>
                <ul class="list-unstyled">
                  <li v-for="type in restaurantTypes" :key="type.id">{{ type.name }}</li>
                </ul>
                <p class="m-0">Indirizzo: <span>{{ restaurantAddress }}</span></p>
                <p class="m-0">
                  Numero: <a href="tel:{{ restaurantPhone }}">{{ restaurantPhone }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista Piatti -->
      <div class="col-12">
        <h2 class="text_orange mb-3">Lista Piatti</h2>
        <h3 v-if="loading" class="text-center text_orange">Caricamento...</h3>
        <h3 v-if="error" class="text-center text_orange">{{ error }}</h3>

        <div class="row g-4">
          <div v-for="dish in dishes" :key="dish.id" class="col-12 col-md-6">
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ dish.name }}</h5>
                <p class="card-text flex-grow-1">{{ dish.description }}</p>
                <p class="text-success">{{ dish.price }} &#8364;</p>
                <button class="btn btn_orange mt-2 w-100" @click.prevent="addToCart(dish)">
                  <i class="fa-solid fa-plus"></i> Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pulsante per andare al carrello -->
        <div class="mt-4 text-center">
          <router-link v-if="cart.length > 0" :to="{ name: 'Cart' }" class="btn btn_orange">
            Vai al carrello ({{ totalQuantity }} piatti)
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text_orange {
  color: rgba(255, 128, 1, 1);
}

.btn_orange {
  background-color: rgba(255, 128, 1, 1);
  color: white;
  &:hover {
    background: rgb(77, 20, 140);
  }
}
</style>