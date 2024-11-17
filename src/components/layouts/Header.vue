<script>
import { useCartStore } from "../../cartStore";

export default {
  name: "Header",
  setup() {
    const cartStore = useCartStore();

    // Carica il carrello dal localStorage quando il componente è montato
    cartStore.loadCartFromLocalStorage();

    return {
      cartStore,
    };
  },
};
</script>

<template>

  <div class="container header">
    <div class="row">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div class="logo">
          <router-link :to="{ name: 'Home' }" class="text_orange link-underline link-underline-opacity-0"> <span class="logo">Delive</span><span class="boo">Boo</span></router-link>
        </div>
        <div class="text-center position-relative pe-1">
          <router-link class="btn bg-orange ms-4" :to="{ name: 'Cart' }">
            <i class="fas fa-cart-shopping text-white"></i>
          </router-link>
          <span class="position-absolute">{{ cartStore.cartLength }}</span>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.header {
  background-color: #4D148C;
}
.position-relative{
  position: relative
}
.position-absolute {
  position: absolute;
  top: -8px; 
  right: -6px; 
  background-color: red;
  border-radius: 50%;
  width: 20px; 
  height: 20px; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  color: white;
  font-size: 12px; 
  font-weight: bold; 
  text-align: center;
}
.bg-orange{
  background-color: rgba(255,128,1,1);
}
.bg-orange:hover{
  background-color: rgba(255,128,1,1);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(255, 255, 255) 0px 0px 0px 2px;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.boo {
  color: rgba(255,128,1,1);
}
</style>
