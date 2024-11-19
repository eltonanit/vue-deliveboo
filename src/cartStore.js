import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
      cart: [], // Stato iniziale del carrello
      showModal: false, // Flag per la modale
      dishToAdd: null, // Piatto da aggiungerez
    }),
    getters: {
      cartLength: (state) => state.cart.reduce((count, dish) => count + dish.quantity, 0),
      totalPrice: (state) =>
        state.cart.reduce((total, dish) => total + parseFloat(dish.price || 0) * dish.quantity, 0).toFixed(2),
    },
    actions: {
      // Aggiungi un piatto al carrello
      addToCart(dish) {
        const existingDish = this.cart.find((item) => item.id === dish.id);

        if (
          this.cart.length > 0 &&
          this.cart[0].restaurant.id !== dish.restaurant.id
        ) {
          this.dishToAdd = dish;
          this.showModal = true; // Mostra la modale
        } else {
          // Se il ristorante è lo stesso, aggiungi normalmente il piatto
          this.addDishToCart(dish);
        }
      },

      addDishToCart(dish) {
        const existingDish = this.cart.find((item) => item.id === dish.id);
  
        if (existingDish) {
          existingDish.quantity += 1;
        } else {
          this.cart.push({
            ...dish,
            price: parseFloat(dish.price),
            quantity: 1,
          });
        }
        this.saveCartToLocalStorage();
      },
  
      // Controlla se è possibile aggiungere un piatto al carrello
      canAddToCart(dish) {
        return (
          this.cart.length === 0 || this.cart[0]?.restaurant?.id === dish.restaurant.id
        );
      },
  
      // Rimuovi un piatto dal carrello
      removeFromCart(dishId) {
        const index = this.cart.findIndex((dish) => dish.id === dishId);

        if (index > -1) {
          if (this.cart[index].quantity > 1) {
            this.cart[index].quantity -= 1; // Riduce la quantità
          } else {
            this.cart.splice(index, 1); // Rimuove completamente il piatto
          }
        }

        this.saveCartToLocalStorage();
      },

      deleteFromCart(dishId) {
        this.cart = this.cart.filter((dish) => dish.id !== dishId);
        this.saveCartToLocalStorage(); // Mantieni aggiornato il localStorage
      },
  
      // Salva il carrello nel localStorage
      saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      },
  
      // Carica il carrello dal localStorage
      loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          this.cart = JSON.parse(storedCart);
        }
      },

      cancelClearCart() {
        this.showModal = false;
        this.dishToAdd = null;
      },

      confirmAddToCart() {
        // Svuota il carrello prima di aggiungere piatti dal nuovo ristorante
        this.cart = [];
  
        if (this.dishToAdd) {
          this.addDishToCart(this.dishToAdd);
        }
  
        this.showModal = false;
        this.dishToAdd = null;
      },

      clearCart() {
        this.cart = [];
        this.saveCartToLocalStorage();
      },
    },
});