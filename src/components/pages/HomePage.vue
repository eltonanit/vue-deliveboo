<template>
  <div class="page-container">
    <!-- Filtro con icone -->
    <div class="mb-4 mt-4">
      <h4 class="text-white text-center mb-3">Filtra per tipologia</h4>
      <div class="d-flex justify-content-center">
        <div
          v-for="type in types"
          :key="type"
          :class="['icon-container', { active: selectedTypes.includes(type) }]"
          @click="toggleType(type)"
          :style="getIconStyle(type)"
        >
          <i :class="getIconClass(type)"></i>
          <p class="text-white">{{ type }}</p>
        </div>
      </div>
    </div>

    <!-- Lista dei ristoranti -->
    <div class="row g-0">
      <div
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        class="col-12 col-md-4 mb-4 d-flex justify-content-center"
      >
        <div class="card card-custom w-75 shadow-sm">
          <img
            src="https://via.placeholder.com/150"
            alt="Restaurant image"
            class="card-img-top img-fluid"
          />
          <div class="card-body">
            <h5 class="card-title">{{ restaurant.name }}</h5>
            <p class="card-text">Indirizzo: {{ restaurant.address }}</p>
            <p class="card-text">Telefono: {{ restaurant.phone }}</p>
            <router-link
              :to="`/restaurant/${restaurant.id}`"
              class="btn btn-primary"
              >Vedi Piatti</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      restaurants: [],
      selectedTypes: [], // Array per le tipologie selezionate
      types: [
        "Italiano",
        "Cinese",
        "Giapponese",
        "Messicano",
        "Indiano",
        "Vegetariano",
        "Americano",
        "Francese",
        "Tailandese",
        "Mediterraneo",
      ],
    };
  },
  computed: {
    filteredRestaurants() {
      if (this.selectedTypes.length === 0) {
        return this.restaurants;
      }
      return this.restaurants.filter((restaurant) => {
        // Controlla se almeno una tipologia del ristorante è selezionata
        return restaurant.types.some((type) =>
          this.selectedTypes.includes(type.name)
        );
      });
    },
  },
  mounted() {
    // Recupera tutti i ristoranti inizialmente
    axios
      .get("http://localhost:8000/api/restaurants")
      .then((response) => {
        this.restaurants = response.data;
        this.filteredRestaurants = this.restaurants; // All'inizio tutti i ristoranti sono visibili
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  },
  methods: {
    toggleType(type) {
      if (this.selectedTypes.includes(type)) {
        this.selectedTypes = this.selectedTypes.filter((t) => t !== type);
      } else {
        this.selectedTypes.push(type);
      }
    },
    getIconClass(type) {
      const icons = {
        Italiano: "fas fa-pizza-slice fa-3x",
        Cinese: "fas fa-cloud-meatball fa-3x",
        Giapponese: "fas fa-fish fa-3x",
        Messicano: "fas fa-pepper-hot fa-3x",
        Indiano: "fas fa-drumstick-bite fa-3x",
        Vegetariano: "fas fa-leaf fa-3x",
        Americano: "fas fa-hamburger fa-3x",
        Francese: "fas fa-bread-slice fa-3x",
        Tailandese: "fas fa-utensils fa-3x",
        Mediterraneo: "fas fa-sun fa-3x",
      };
      return icons[type];
    },
    getIconStyle(type) {
      const colors = {
        Italiano: "color: #d32f2f;",
        Cinese: "color: #e64a19;",
        Giapponese: "color: #3f51b5;",
        Messicano: "color: #ff5722;",
        Indiano: "color: #ff9800;",
        Vegetariano: "color: #4caf50;",
        Americano: "color: #795548;",
        Francese: "color: #fbc02d;",
        Tailandese: "color: purple;",
        Mediterraneo: "color: #ffeb3b;",
      };
      return colors[type];
    },
  },
};
</script>

<style scoped>
.icon-container {
  text-align: center;
  margin-right: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.icon-container:hover {
  transform: scale(1.1);
}
.icon-container p {
  margin-top: 5px;
}
.icon-container.active {
  background-color: #f0f0f079;
  border-radius: 5px;
  padding: 5px;
}

.card-custom {
  width: 100%; /* Riduce la larghezza della card */
  max-width: 550px; /* Imposta una larghezza massima */
  margin: auto; /* Centra la card nella colonna */
}

.card-custom .card-img-top {
  height: 150px; /* Riduce l’altezza dell’immagine */
  object-fit: cover; /* Assicura che l’immagine si adatti senza deformarsi */
}

.card-custom .card-body {
  padding: 10px; /* Riduce il padding per una visualizzazione più compatta */
}

.card-custom .card-title {
  font-size: 1.1rem; /* Riduce leggermente la dimensione del titolo */
}

.card-custom .card-text {
  font-size: 0.9rem; /* Riduce la dimensione del testo */
}
</style>
