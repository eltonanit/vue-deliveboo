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
  props: ['restaurantId'],
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
        if (this.paymentLoading) return; // Evita più richieste contemporanee
        this.paymentLoading = true;
        this.paymentError = null;

        this.dropinInstance.requestPaymentMethod(async (err, payload) => {
            if (err) {
                this.paymentError = "Errore nel metodo di pagamento.";
                this.paymentLoading = false;
                return;
            }

            try {
                const response = await axios.post("http://localhost:8000/api/payment/checkout", {
                    nonce: payload.nonce,
                    cart: this.cart,
                    customerName: this.customerName,
                    customerSurname: this.customerSurname,
                    shippingAddress: this.shippingAddress,
                });

                if (response.data.success) {
                    alert("Pagamento completato con successo!");
                    this.cartStore.clearCart();
                    this.$router.push({ name: "Home" });
                } else {
                    this.paymentError = response.data.message || "Errore durante il pagamento.";
                }
            } catch (error) {
                this.paymentError = "Errore di connessione con il server.";
            } finally {
                this.paymentLoading = false;
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
  <div class="container-cart py-4">
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
    <h2 class="text_orange mb-3">Carrello</h2>
    <ul class="list-group mb-3">
      <li
        v-for="dish in cart"
        :key="dish.id"
        class="list-group-item d-flex justify-content-between overflow-y"
      >
        <span>{{ dish.name }} (x{{ dish.quantity }})</span>
        <!-- Mostra la quantità -->
        <span>{{ dish.price }} €</span>
        <button class="btn btn-danger btn-sm" @click="removeFromCart(dish.id)">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    </ul>
    <div class="d-flex justify-content-between">
      <span class="text-white">Totale:</span>
      <span class="text-white">{{ totalPrice }} €</span>
    </div>
    <button class="btn btn_orange mt-3 w-100" @click="togglePaymentForm">
      Procedi al pagamento
    </button>

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
</template>

<style lang="scss" scoped>
.text_orange {
  color: rgba(255, 128, 1, 1);
}
.container-cart {
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
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
