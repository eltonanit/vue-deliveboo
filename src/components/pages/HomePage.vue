<script>
export default {
  props: ["restaurant"],
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ restaurant.name }}</h5>
      <p class="card-text">{{ restaurant.type }}</p>
      <router-link :to="`/menu/${restaurant.id}`" class="btn btn-primary"
        >Vedi Menù</router-link
      >
    </div>
  </div>
</template>

<style></style>
