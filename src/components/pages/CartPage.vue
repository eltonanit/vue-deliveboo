<template>
  <div class="container-cart py-4">
    <h2 class="text_orange mb-3">Carrello</h2>
    <ul class="list-group mb-3">
      <li
        v-for="dish in cart"
        :key="dish.id"
        class="list-group-item d-flex justify-content-between overflow-y"
      >
        <span>{{ dish.name }}</span>
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
    async togglePaymentForm() {
      if (this.cart.length === 0) {
        alert("Il carrello è vuoto!");
        return;
      }

      // Mostra il form di pagamento
      this.showPaymentForm = true;

      // Recupera il Client Token da Braintree
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
        console.error("Errore durante il recupero del token:", error);
        alert("Errore nel configurare il pagamento.");
      }
    },

    setupBraintree() {
      dropin.create(
        {
          authorization: this.clientToken,
          container: "#dropin-container",
          card: {
            cardholderName: {
              required: true,
            },
            overrides: {
              fields: {
                cvv: {
                  required: true,
                },
              },
            },
          },
        },
        (err, instance) => {
          if (err) {
            console.error("Errore durante la creazione del Drop-in UI:", err);
            alert("Errore nella configurazione del pagamento.");
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

      const customerName = prompt("Inserisci il tuo nome:");
      const customerSurname = prompt("Inserisci il tuo cognome:");
      const shippingAddress = prompt(
        "Inserisci il tuo indirizzo di spedizione:"
      );

      if (!customerName || !customerSurname || !shippingAddress) {
        alert("Tutti i dati sono obbligatori!");
        return;
      }

      this.dropinInstance.requestPaymentMethod(async (err, payload) => {
        if (err) {
          console.error("Errore nel pagamento:", err);
          alert("Errore nel metodo di pagamento.");
          return;
        }

        const paymentData = {
          nonce: payload.nonce,
          amount: this.totalPrice,
          customer_name: customerName,
          customer_surname: customerSurname,
          shipping_address: shippingAddress,
          total_items: this.cart.length,
        };

        try {
          const response = await axios.post(
            "http://localhost:8000/api/payment/submit",
            paymentData
          );

          if (response.data.success) {
            alert("Pagamento completato con successo!");
            await this.saveOrder(response.data.orderId);
            this.cart = [];
            localStorage.removeItem("cart");
            this.showPaymentForm = false;
          } else {
            alert(
              `Errore nel completamento del pagamento: ${response.data.error}`
            );
          }
        } catch (error) {
          console.error("Errore durante il pagamento:", error);
          alert("Pagamento fallito.");
        }
      });
    },

    async saveOrder(orderId) {
      try {
        const orderData = {
          order_id: orderId,
          customer_name: this.customer_name,
          customer_surname: this.customer_surname,
          shipping_address: this.shipping_address,
          items: this.cart.map((dish) => ({
            id: dish.id,
            name: dish.name,
            price: dish.price,
          })),
          total_price: this.totalPrice,
        };

        await axios.post("http://localhost:8000/api/orders/save", orderData);
        console.log("Ordine salvato con successo nel database");
      } catch (error) {
        console.error("Errore nel salvataggio dell'ordine:", error);
        alert("Errore nel salvataggio dell'ordine.");
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
