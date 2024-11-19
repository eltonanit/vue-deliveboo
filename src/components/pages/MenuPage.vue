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
      info_visible: false,
      selectedDishId: null,
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
    infoVisible() {
      this.info_visible =!this.info_visible;
    }
  },

  mounted() {
    this.ristoranteAttuale = this.$route.params.restaurantId;
    this.fetchDishes();
  },
  computed: {
    restaurantName() {
      return this.dishes[0]?.restaurant?.name || "Ristorante";
    },
    restaurantImage() {
      return this.dishes[0]?.restaurant?.image || "../public/assets/img/test-ristorante.jpg";
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
      <div class="col-12">

        <router-link :to="{ name: 'Home' }" class="text_orange link-underline link-underline-opacity-0">
          <i class="fa-solid fa-arrow-left"></i> Indietro
        </router-link>

        <div class="card border-0 bg-transparent mb-3 mt-3">
          <div class="row g-0">

            <div class="col-12 col-md-4 d-flex justify-content-center">
              <div class="img_box">
                <img :src="restaurantImage" class="img-fluid border rounded" alt="Restaurant image"/>
              </div>
            </div>
            
            <!-- Struttura Mobile -->
            <div class="col-12 col-md-8 text-white d-flex flex-column justify-content-evenly d-md-none">
              <h1 class="card-title text-center my-3 text_orange">{{ restaurantName }}</h1>

              <div class="d-flex justify-content-between cursor_pointer" @click="infoVisible()">
                <h6>Informazioni Ristorante</h6>
                <i class="fa-solid" :class="info_visible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </div>

              <div :class="[{'d-block': info_visible}, {'d-none': !info_visible}]">
                <div class="my-3">
                  <h6 class="text_orange">Tipologie</h6>
                  <span v-for="type in restaurantTypes" :key="type.id" class="fst-italic me-2">
                    {{ type.name }}
                  </span>
                </div>
  
                <div>
                  <p class="m-0">
                  <h6 class="m-0 text_orange">Ci trovi in</h6>
                  <p class="fst-italic">{{ restaurantAddress }}</p>
                  </p>
                  <p class="m-0">
                  <h6 class="mb-1 text_orange">Vuoi chiedere informazioni? <i class="fa-solid fa-arrow-down"></i></h6>
                  <span>Chiama qui: </span><a class="text-decoration-none text-white fst-italic icon-link"
                    href="tel:{{ restaurantPhone }}">{{ restaurantPhone }}</a>
                  </p>
                </div>
              </div>

            </div>

            <!-- Struttura Desktop -->
            <div class="d-none col-12 col-md-8 text-white d-md-flex flex-column justify-content-evenly">

              <div class="ms-3">
                <h2 class="card-title text_orange">{{ restaurantName }}</h2>
                <span v-for="type in restaurantTypes" :key="type.id" class="fst-italic me-2">
                  {{ type.name }}
                </span>
              </div>

              <div class="ms-3">
                <p class="m-0">
                <h6 class="m-0 text_orange">Ci trovi in:</h6>
                <p class="fst-italic">{{ restaurantAddress }}</p>
                </p>
                <p class="m-0">
                <p class="mb-1 text_orange">Vuoi chiedere informazioni? <i class="fa-solid fa-arrow-down"></i></p>
                <span>Chiama qui: </span><a class="text-decoration-none text-white fst-italic icon-link"
                  href="tel:{{ restaurantPhone }}">{{ restaurantPhone }}</a>
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      <!-- Lista Piatti -->
      <div class="col-12 col-lg-8">
        <h2 class="text_orange text-center my-3">Lista Piatti</h2>
        <h3 v-if="loading" class="text-center text_orange">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </h3>
        <h3 v-if="error" class="text-center text_orange">{{ error }}</h3>

        <div class="row g-4">
          <div v-for="dish in dishes" :key="dish.id" class="col-12 col-md-6">
            <div class="card border-0 h-100 shadow-sm">
              <div v-if="dish.visible" class="card-body d-flex flex-column">
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

      <!-- Carrello dinamico -->
      <div class="d-none d-lg-block col-4 fixed-cart">
        <div class="card">
          <div class="card-header bg-white text-center">
            <p class="text_orange fs-5 m-0">Carrello</p>
          </div>
          <div class="card-body">
            <div v-if="cartStore.cart.length > 0" class="list-group">
              <div v-for="dish in cartStore.cart" :key="dish.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <p class="m-0"><span class="text-muted">({{ dish.quantity }}x)</span> {{ dish.name }}</p>
                <!-- bottone eliminazione con modale per decidere quanti piatti eliminare -->
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  @click="selectedDishId = dish.id"
                  class="btn btn-sm btn-outline-danger"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <!-- Modal per confermare l'eliminazione di un piatto -->
                <div class="modal fade w-75" id="deleteModal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Conferma eliminazione</h5>
                      </div>
                      <div class="modal-body">
                        <p>Sei sicuro di voler eliminare 
                          <strong>
                            {{ cartStore.cart.find(d => d.id === selectedDishId)?.name || 'questo piatto' }}
                          </strong> 
                          dal carrello?
                        </p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-danger" @click.prevent="cartStore.deleteFromCart(selectedDishId)"
                        data-bs-dismiss="modal">Si</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <button
              v-if="cartStore.cart.length > 0"
              class="btn btn-block btn_orange"
              @click.prevent="clearCart"
            >
              Svuota il carrello
            </button> -->
            <div class="text-center">
              <div v-if="cartStore.cart.length > 0">
                <p class="text_orange fs-5 mt-3">
                  Totale: {{ cartStore.totalPrice }} &#8364;
                </p>
                <router-link :to="{ name: 'Cart' }">
                  <button
                    class="btn btn-block btn_orange"
                  >
                    Procedi con il checkout
                  </button>
                </router-link>
              </div>
              <div v-else class="text-center">
                <p class="py-5 border-bottom border-2">
                  Il carrello è vuoto
                </p>
                <p class="text-center text_orange fs-5">
                  Totale: {{ cartStore.totalPrice }} &#8364;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modale per confermare l'aggiunta di un piatto da un ristorante diverso -->
    <div v-if="cartStore.showModal" class="modal fade show"
      style="display: block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
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
            <button type="button" class="btn btn-secondary" @click="cancelClearCart">
              Annulla
            </button>
            <button type="button" class="btn btn_orange" @click="confirmAddToCart">
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

.cursor_pointer {
  cursor: pointer;
}

.btn_orange {
  background-color: rgba(255, 128, 1, 1);
  color: white;
  &:hover {
    background: rgb(77, 20, 140);
  }
}

.fixed-cart {
  position: sticky; /* Rende il carrello fisso */
  top: 20px; /* Regola la distanza dal bordo superiore */
  z-index: 1051; /* Assicura che il filtro sia sopra ad altri elementi */
  height: fit-content;
}

.img_box {
  width: 250px;
  height: 200px;
  img {
    width: 100%;
    height: 100%;
    padding: 10px;
    object-fit: cover;
    object-position: top;
  }
}

@media screen and (min-width: 768px) {
 .img_box {
  width: 100%;
  height: 300px;
  object-fit: cover;
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
