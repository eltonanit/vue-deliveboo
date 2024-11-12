<template>
  <div class="container py-4">
    <h2 class="text_orange mb-3">Carrello</h2>
    <ul class="list-group mb-3">
      <li
        v-for="dish in cart"
        :key="dish.id"
        class="list-group-item d-flex justify-content-between"
      >
        <span>{{ dish.name }}</span>
        <span>{{ dish.price }} €</span>
        <button class="btn btn-danger btn-sm" @click="removeFromCart(dish.id)">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    </ul>
    <div class="d-flex justify-content-between">
      <span>Totale:</span>
      <span class="text-success">{{ totalPrice }} €</span>
    </div>
    <button class="btn btn_orange mt-3 w-100" @click="togglePaymentForm">
      Procedi al pagamento
    </button>

    <!-- Form di pagamento -->
    <div v-if="showPaymentForm" class="payment-form mt-3">
      <h3>Paga ora</h3>
      <div id="dropin-container"></div>
      <button class="btn btn-success mt-3 w-100" @click="submitPayment">
        Paga {{ totalPrice }} €
      </button>
    </div>
  </div>
</template>

<script>
import dropin from "braintree-web-drop-in";
import axios from "axios";

export default {
  data() {
    return {
      cart: [],
      totalPrice: 0,
      showPaymentForm: false,
      dropinInstance: null,
      clientToken: null,
    };
  },
  methods: {
    togglePaymentForm() {
      if (this.cart.length === 0) {
        alert("Il carrello è vuoto!");
        return;
      }

      // Mostra il form di pagamento
      this.showPaymentForm = true;

      // Recupera il Client Token da Braintree
      if (!this.clientToken) {
        this.getClientToken();
      } else {
        this.setupBraintree();
      }
    },
    getClientToken() {
      axios
        .get("http://localhost:8000/api/payment/token")
        .then((response) => {
          this.clientToken = response.data.token;
          this.setupBraintree();
        })
        .catch((error) => {
          console.error("Errore nel recupero del token:", error);
          alert("Errore nel configurare il pagamento.");
        });
    },
    setupBraintree() {
      dropin.create(
        {
          authorization: this.clientToken,
          container: "#dropin-container",
        },
        (err, instance) => {
          if (err) {
            console.error(err);
            alert("Errore nella configurazione del pagamento.");
            return;
          }
          this.dropinInstance = instance;
        }
      );
    },
    submitPayment() {
      if (this.dropinInstance) {
        this.dropinInstance.requestPaymentMethod((err, payload) => {
          if (err) {
            console.error("Errore nel pagamento:", err);
            alert("Errore nel metodo di pagamento.");
            return;
          }

          const paymentData = {
            nonce: payload.nonce,
            amount: this.totalPrice,
          };

          // Invia la richiesta di pagamento al backend
          axios
            .post("/api/payment/submit", paymentData)
            .then((response) => {
              if (response.data.success) {
                alert("Pagamento completato con successo!");
                // Svuota il carrello
                this.cart = [];
                localStorage.removeItem("cart");
                this.showPaymentForm = false;
              } else {
                alert("Errore nel completamento del pagamento.");
              }
            })
            .catch((error) => {
              console.error("Errore durante il pagamento:", error);
              alert("Pagamento fallito.");
            });
        });
      }
    },
    removeFromCart(dishId) {
      const index = this.cart.findIndex((dish) => dish.id === dishId);
      if (index > -1) {
        this.cart.splice(index, 1);
        this.calculateTotalPrice();
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },
    calculateTotalPrice() {
      this.totalPrice = this.cart.reduce(
        (total, dish) => total + parseFloat(dish.price),
        0
      );
    },
  },
  mounted() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.calculateTotalPrice();
    }
  },
};
</script>

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
