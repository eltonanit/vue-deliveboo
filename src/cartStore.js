import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
      cart: [], // Stato iniziale del carrello
    }),
    getters: {
      cartLength: (state) => state.cart.length, // Lunghezza del carrello
      totalPrice: (state) =>
        state.cart.reduce((total, dish) => total + parseFloat(dish.price || 0), 0).toFixed(2),
    },
    actions: {
      // Aggiungi un piatto al carrello
      addToCart(dish) {
        if (this.canAddToCart(dish)) {
          this.cart.push(dish);
          this.saveCartToLocalStorage();
        } else {
          const confirmClear = confirm(
            "Hai piatti da un altro ristorante nel carrello. Vuoi svuotarlo e aggiungere i nuovi piatti?"
          );
          if (confirmClear) {
            this.cart = [dish];
            this.saveCartToLocalStorage();
          }
        }
      },
  
      // Controlla se è possibile aggiungere un piatto al carrello
      canAddToCart(dish) {
        return (
          this.cart.length === 0 ||
          this.cart[0]?.restaurant?.id === dish.restaurant.id
        );
      },
  
      // Rimuovi un piatto dal carrello
      removeFromCart(dishId) {
        this.cart = this.cart.filter((dish) => dish.id !== dishId);
        this.saveCartToLocalStorage();
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
    },
});