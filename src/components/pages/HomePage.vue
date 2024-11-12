<script>
import axios from "axios";
import { store } from "../../store.js"
import { toggleType, filterRestaurants, getIconClass, getIconColor } from "../../utils/helpers";

export default {
  data() {
    return {
      store,
      restaurants: [],
      selectedTypes: [], // Array per le tipologie selezionate
      types: [
        "Italiano", "Giapponese", "Messicano", "Indiano", "Vegetariano", "Americano", "Cinese", "Francese", "Tailandese", "Mediterraneo"],
      searchTerm: '',
      types_visible: false,
      loading: false,
      error: null,
    };
  },
  computed: {
    filteredRestaurants() {
      return filterRestaurants(this.restaurants, this.selectedTypes, this.searchTerm);
    },
  },
  methods: {
    fetchRestaurants() {
      this.loading = true;
      this.error = null;

      // Recupera tutti i ristoranti inizialmente
      axios.get(`${store.baseUrl}/restaurants`).then((response) => {
        if (response.data.success) {
          this.restaurants = response.data.data;
          // this.filteredRestaurants = this.restaurants; // All'inizio tutti i ristoranti sono visibili
        } else {
          this.error = "Si è verificato un errore nel recupero dei ristoranti.";
        }
      }).catch((error) => {
          this.error = "Errore di connessione al server.";
          console.error(error);
      }).finally(() => {
        this.loading = false;
      });
      this.types.sort();
    },
    toggleType(type) {
      toggleType(this, type);
    },
    getIconClass,
    getIconColor,
    visibleTypes() {
      this.types_visible = !this.types_visible;
    },
  },
  mounted() {
    this.fetchRestaurants()

  },
};
</script>

<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-12 mb-5 col-lg-3 text-white">
        <h5 class="mb-3">Filtra Ristoranti</h5>
          <div class="input-group mb-4">
            <input class="form-control" type="text" v-model="searchTerm" placeholder="Nome ristorante">
            <span class="input-group-text" id="basic-addon2"><i class="fa-solid fa-magnifying-glass"></i></span>
          </div>
          <div class="d-flex justify-content-between" @click="visibleTypes()">
            <h6>Tipologia</h6>
            <i class="ms-3"></i>
          </div>
          <!-- Filtro con icone -->
          <div id="my_types_container" class="d-flex flex-wrap">
            <div id="single_type" class="d-flex align-items-center m-0 mb-2 p-1 me-1" v-for="type in types" :key="type" :class="['icon-container', { active: selectedTypes.includes(type)}]" @click="toggleType(type)" :style="{ color: getIconColor(type) }">
              <i class="me-1" :class="getIconClass(type)"></i>
              <p class="text-white m-0">{{ type }}</p>
              <p class="text-secondary m-0 d-none" :class="{ 'd-block' : selectedTypes.includes(type) }" >Check</p>
            </div>
          </div>
      </div>
      <div class="col-12 col-lg-9">
        <!-- Lista dei ristoranti -->
        <div class="row g-0">
          <h3 v-if="loading" class="text-center text_orange">Caricamento...</h3>
          <h3 v-if="error" class="text-center text_orange">{{ error }}</h3>

          <div v-if="!loading & !error" v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="col-12 col-md-4 mb-4 d-flex justify-content-center">
            <div class="card border-0 card-custom w-75 shadow-sm">
              <img src="https://picsum.photos/450/450" alt="Restaurant image" class="card-img-top img-fluid"/>
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text">{{ restaurant.types.map(type => type.name).sort().join(", ") }}</p>
                <p class="card-text">Indirizzo: {{ restaurant.address }}</p>
                <span class="d-lg-none">Telefono: <a class="text-dark" href="tel:{{ restaurant.phone }}">{{ restaurant.phone }}</a></span>
                <p class="card-text d-none d-lg-block">Telefono: {{ restaurant.phone }}</p>
                <router-link
                  :to="{ name: 'Menu', params: { restaurantId: restaurant.id} }"
                  class="btn btn_orange">Vedi Piatti
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

#my_types_container {
  cursor: pointer;
  #single_type {
    /* background-color: rgba(255, 255, 255, 0.233); */
    border-radius: 15px;
  }
}

.text_orange {
  color: rgba(255,128,1,1);
}

.btn_orange {
  background-color: rgba(255,128,1,1);
  color: white;
  &:hover {
  background: rgb(77,20,140);
  }
}

.cursor_pointer {
  cursor: pointer;
}

.icon-container {
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
