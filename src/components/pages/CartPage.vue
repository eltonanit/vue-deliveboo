<script>
import dropin from "braintree-web-drop-in";
import axios from "axios";
import { useCartStore } from "../../cartStore";

export default {
  setup() {
    const cartStore = useCartStore();
    cartStore.loadCartFromLocalStorage();
    return {
      cartStore,
    };
  },
  data() {
    return {
      showPaymentForm: false,
      customerName: "",
      customerSurname: "",
      shippingAddress: "",
      dropinInstance: null,
      clientToken: null,
      paymentLoading: false,
      paymentError: null,
    };
  },
  computed: {
    cart() {
      return this.cartStore.cart;
    },
    totalPrice() {
      return this.cartStore.totalPrice;
    },
  },

  methods: {
    async togglePaymentForm() {
      if (this.cartStore.cartLength === 0) {
        alert("Il carrello è vuoto!");
        return;
      }

      this.showPaymentForm = true;

      if (!this.clientToken) {
        await this.getClientToken();
      } else {
        this.setupBraintree();
      }
    },

    async getClientToken() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/payment/token"
        );
        this.clientToken = response.data.token;

        if (!this.clientToken) {
          alert("Errore nel recupero del token di pagamento.");
          return;
        }

        this.setupBraintree();
      } catch (error) {
        alert("Errore nel configurare il pagamento.");
      }
    },

    setupBraintree() {
      dropin.create(
        {
          authorization: this.clientToken,
          container: "#dropin-container",
        },
        (err, instance) => {
          if (err) {
            console.error("Errore durante la creazione del Drop-in UI:", err);
            return;
          }
          this.dropinInstance = instance;
        }
      );
    },

    async submitPayment() {
      if (!this.dropinInstance) {
        alert("Errore nel metodo di pagamento.");
        return;
      }

      if (
        !this.customerName ||
        !this.customerSurname ||
        !this.shippingAddress
      ) {
        alert("Tutti i dati sono obbligatori!");
        return;
      }

      this.dropinInstance.requestPaymentMethod(async (err, payload) => {
        if (err) {
          alert("Errore nel metodo di pagamento.");
          return;
        }

        const paymentData = {
          nonce: payload.nonce,
          amount: parseFloat(this.totalPrice) || 0,  // Correzione per garantire che sia un numero
          cart: this.cart,
          customer_name: this.customerName,
          customer_surname: this.customerSurname,
          shipping_address: this.shippingAddress,
          total_items: this.cart.length,
        };

        try {
          const response = await axios.post("http://localhost:8000/api/payment/submit", paymentData);

          if (response.data.success) {
            alert("Pagamento completato con successo!");
            this.cartStore.cart = [];
            localStorage.removeItem("cart");
            this.showPaymentForm = false;
          } else {
            alert(`Errore nel completamento del pagamento: ${response.data.error}`);
          }
        } catch (error) {
          alert("Pagamento fallito.");
        }
      });
    },

    removeFromCart(dishId) {
      this.cartStore.removeFromCart(dishId);
    },
  },
};
</script>

<template>
  <div class="container py-5">
    <div class="row">
      <!-- <div class="col-12 py-2">
        <div v-if="restaurantId">
          <router-link
              :to="{ name: 'Menu', params: { restaurantId: restaurantId } }"
              class="text_orange link-underline link-underline-opacity-0"
            >
              <i class="fa-solid fa-arrow-left"></i> Indietro
            </router-link>
        </div>
        <div v-else>
          <p>Ristorante non trovato</p>
        </div>
      </div> -->

      <div class="col-12 py-3">
        <h2 class="text_orange mb-3">Carrello</h2>
        <ul class="list-group mb-3">
          <li
            v-for="dish in cart"
            :key="dish.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <!-- Contenitore per il nome del piatto e il bottone di delete -->
            <div class="d-flex justify-content-between p-2">
              <span>- {{ dish.name }} (x{{ dish.quantity }})</span>
              <button class="btn btn-danger btn-sm ms-3" @click="removeFromCart(dish.id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <!-- Prezzo allineato a destra sulla stessa riga -->
            <span class="text-success ms-auto">{{ (dish.price * dish.quantity).toFixed(2) }} €</span>
          </li>
        </ul>
        <div class="d-flex justify-content-between p-3">
          <span class="text-white">Totale:</span>
          <span class="text-white">{{ totalPrice }} €</span>
        </div>
        <button class="btn btn_orange mt-3 w-100" @click="togglePaymentForm">
          Procedi al pagamento
        </button>
      </div>

      <div class="col-12 py-2">
        <div v-if="showPaymentForm" class="payment-form mt-3">
          <h3>Paga ora</h3>
          <form @submit.prevent="submitPayment">
            <div class="form-group mb-3">
              <label for="customerName">Nome</label>
              <input
                type="text"
                id="customerName"
                v-model="customerName"
                class="form-control"
                required
              />
            </div>
    
            <div class="form-group mb-3">
              <label for="customerSurname">Cognome</label>
              <input
                type="text"
                id="customerSurname"
                v-model="customerSurname"
                class="form-control"
                required
              />
            </div>
    
            <div class="form-group mb-3">
              <label for="shippingAddress">Indirizzo di spedizione</label>
              <input
                type="text"
                id="shippingAddress"
                v-model="shippingAddress"
                class="form-control"
                required
              />
            </div>
    
            <div id="dropin-container" v-if="clientToken"></div>
            <!-- Solo se il clientToken è disponibile -->
    
            <button type="submit" class="btn btn-success mt-3 w-100"
              :disabled="paymentLoading || !customerName || !customerSurname || !shippingAddress"
              @click.prevent="submitPayment">
              <span v-if="paymentLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else>Paga {{ totalPrice }} €</span>
            </button>
          </form>
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
  width: 100%;
  &:hover {
    background-color: rgb(77, 20, 140);
  }
}

.payment-form {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}
</style>
