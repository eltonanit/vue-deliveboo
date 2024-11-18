<script>
import axios from "axios";
import { store } from "../../store.js";
import { useCartStore } from "../../cartStore.js";

export default {
  props: ["restaurantId"],
  setup() {
    const cartStore = useCartStore();
    cartStore.loadCartFromLocalStorage(); // Caricamento al setup

    return {
      cartStore,
    };
  },
  data() {
    return {
      store,
      dishes: [],
      loading: false,
      error: null,
      ristoranteAttuale: null,
    };
  },
  methods: {
    fetchDishes() {
      this.loading = true;
      this.error = null;

      axios
        .get(`${this.store.baseUrl}/dishes?restaurant_id=${this.restaurantId}`)
        .then((response) => {
          if (response.data.success) {
            this.dishes = response.data.data.map((dish) => ({
              ...dish,
              price: parseFloat(dish.price), // Converte il prezzo in numero
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
    // Aggiunta piatto al carrello
    addToCart(dish) {
      this.cartStore.addToCart(dish); // Chiama il metodo dello store
    },
    cancelClearCart() {
      this.cartStore.cancelClearCart();
    },
    confirmAddToCart() {
      // Logica di conferma
      this.cartStore.confirmAddToCart();
    },
  },

  mounted() {
    this.ristoranteAttuale = this.$route.params.restaurantId;
    this.fetchDishes();
  },
  computed: {
    restaurantName() {
      return this.dishes[0]?.restaurant?.name || "Ristorante";
    },
    restaurantTypes() {
      return this.dishes[0]?.restaurant?.types || "Tipologie non disponibili";
    },
    restaurantAddress() {
      return this.dishes[0]?.restaurant?.address || "Indirizzo non disponibile";
    },
    restaurantPhone() {
      return this.dishes[0]?.restaurant?.phone || "Numero non disponibile";
    },
    totalPrice() {
      return this.cartStore.cart
        .reduce((total, dish) => total + parseFloat(dish.price || 0)* dish.quantity, 0)
        .toFixed(2); // Formattato con due decimali
    },

    // Calcolo del numero totale di piatti nel carrello
    totalQuantity() {
      return this.cart.reduce((total, dish) => total + dish.quantity, 0);
    },
  },
};
</script>

<template>
  <div class="container py-4">
    <div class="row">
      <!-- Informazioni Ristorante -->
      <div class="col-12 mb-5">
        <router-link
          :to="{ name: 'Home' }"
          class="text_orange link-underline link-underline-opacity-0"
        >
          <i class="fa-solid fa-arrow-left"></i> Indietro
        </router-link>
        <div class="card border-0 bg-transparent mb-3 mt-3">
          <div class="row g-0 ">
            <div class="col-md-4">
              <img
                src="https://picsum.photos/420/250"
                class="img-fluid rounded"
                alt="Restaurant image"
              />
            </div>
            <div class="col-md-8 text-white d-flex flex-column justify-content-evenly">
              <div>
                <h2 class="card-title text_orange">{{ restaurantName }}</h2>
                <span v-for="type in restaurantTypes" :key="type.id" class="fst-italic me-2">
                  {{ type.name }}
                </span>
              </div>
              <div>
                <p class="m-0">
                  <p class="m-0">Ci trovi in:</p> 
                  <p class="fst-italic">{{ restaurantAddress }}</p>
                </p>
                <p class="m-0">
                  <p class="mb-1">Vuoi chiedere informazioni? <i class="fa-solid fa-arrow-down"></i></p>
                  <span>Chiama qui: </span><a class="text-decoration-none text_orange fst-italic icon-link" href="tel:{{ restaurantPhone }}">{{ restaurantPhone }}</a>
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
          <router-link
            v-if="cartStore.cart.length > 0"
            :to="{ name: 'Cart' }"
            class="btn btn_orange border"
          >
            Vai al carrello ({{ cartStore.cartLength }} piatti)
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modale per confermare l'aggiunta di un piatto da un ristorante diverso -->
    <div
      v-if="cartStore.showModal"
      class="modal fade show"
      style="display: block; background-color: rgba(0, 0, 0, 0.5);"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Carrello</h5>
          </div>
          <div class="modal-body">
            <p>
              Stai per aggiungere un piatto da un altro ristorante. Vuoi
              svuotare il carrello e aggiungere questo piatto?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelClearCart"
            >
              Annulla
            </button>
            <button
              type="button"
              class="btn btn_orange"
              @click="confirmAddToCart"
            >
              Conferma
            </button>
          </div>
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

.modal-dialog-centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 450px;
  width: 100%;
}
</style>
