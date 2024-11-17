<template>
  <div class="container-cart py-4">
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

        <button type="submit" class="btn btn-success mt-3 w-100">
          Paga {{ totalPrice }} €
        </button>
      </form>
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
      customerName: "",
      customerSurname: "",
      shippingAddress: "",
      dropinInstance: null,
      clientToken: null,
    };
  },
  methods: {
    async togglePaymentForm() {
      if (this.cart.length === 0) {
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

      // Verifica che tutti i campi siano compilati
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
          amount: parseFloat(this.totalPrice) || 0, // Correzione per garantire che sia un numero
          cart: this.cart,
          customer_name: this.customerName,
          customer_surname: this.customerSurname,
          shipping_address: this.shippingAddress,
          total_items: this.cart.length,
        };

        try {
          const response = await axios.post(
            "http://localhost:8000/api/payment/submit",
            paymentData
          );

          if (response.data.success) {
            alert("Pagamento completato con successo!");
            // Salva l'ordine nel database
            // await this.createOrder(response.data.orderId);

            // Svuota il carrello
            this.cart = [];
            localStorage.removeItem("cart");
            this.showPaymentForm = false;
          } else {
            alert(
              `Errore nel completamento del pagamento: ${response.data.error}`
            );
          }
        } catch (error) {
          alert("Pagamento fallito.");
        }
      });
    },

    removeFromCart(dishId) {
      const index = this.cart.findIndex((dish) => dish.id === dishId);
      if (index > -1) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity -= 1;
        } else {
          this.cart.splice(index, 1);
        }
        this.calculateTotalPrice();
        localStorage.setItem("cart", JSON.stringify(this.cart));
      }
    },

    calculateTotalPrice() {
      this.totalPrice = this.cart.reduce(
        (total, dish) => total + parseFloat(dish.price) * dish.quantity,
        0
      );

      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
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
