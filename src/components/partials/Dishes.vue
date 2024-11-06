<script>
export default {
  props: ["dish"],
  data() {
    return {
      quantity: 1
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", { ...this.dish, quantity: this.quantity });
    }
  }
};
</script>

<template>
  <div class="menu-item">
    <h5>{{ dish.name }}</h5>
    <p>{{ dish.description }} - {{ dish.price }} €</p>
    <input type="number" v-model.number="quantity" min="1" class="form-control mb-2" placeholder="Quantità" />
    <button @click="addToCart" class="btn btn-success">Aggiungi al Carrello</button>
  </div>
</template>