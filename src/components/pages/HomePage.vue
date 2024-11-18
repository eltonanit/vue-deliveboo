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
      types: ["Italiano", "Giapponese", "Messicano", "Indiano", "Vegetariano", "Americano", "Cinese", "Francese", "Tailandese", "Mediterraneo"],
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
    <div class="row py-5">
      <div class="filters-fixed col-12 mb-5 col-lg-3 text-white">
        <h5 class="mb-3">Filtra Ristoranti</h5>
        <div class="input-group mb-4">
          <input class="form-control" type="text" v-model="searchTerm" placeholder="Nome ristorante">
          <span class="input-group-text" id="basic-addon2"><i class="fa-solid fa-magnifying-glass"></i></span>
        </div>

        <!-- div mobile -->
        <div id="my_types_container" class="d-flex justify-content-between d-md-none" @click="visibleTypes()">
          <h6>Tipologia</h6>
          <i class="fa-solid" :class="types_visible ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
        <!-- div tablet in su -->
        <div class="d-flex justify-content-between d-none d-md-block">
          <h6>Tipologia</h6>
        </div>

        <!-- Filtro con icone mobile -->
        <div class="d-flex flex-wrap d-md-none" :class="[{'d-block': types_visible}, {'d-none': !types_visible}]">
          <div class="d-flex align-items-center rounded_15 m-0 mb-2 p-1 me-1" v-for="type in types" :key="type"
            :class="['icon-container', { active: selectedTypes.includes(type)}]" @click="toggleType(type)"
            :style="{ color: getIconColor(type) }">
            <i class="me-1" :class="getIconClass(type)"></i>
            <p class="text-white m-0">{{ type }}</p>
            <p class="text-secondary m-0 d-none" :class="{ 'd-block' : selectedTypes.includes(type) }">Check</p>
          </div>
        </div>

        <!-- Filtro con icone desktop in su-->
        <div class="d-none d-md-flex flex-wrap">
          <div class="d-flex align-items-center rounded_15 m-0 mb-2 p-1 me-1" v-for="type in types" :key="type"
            :class="['icon-container', { active: selectedTypes.includes(type)}]" @click="toggleType(type)"
            :style="{ color: getIconColor(type) }">
            <i class="me-1" :class="getIconClass(type)"></i>
            <p class="text-white m-0">{{ type }}</p>
            <p class="text-secondary m-0 d-none" :class="{ 'd-block' : selectedTypes.includes(type) }">Check</p>
          </div>
        </div>

      </div>
      <div class="col-12 col-lg-9">
        <!-- Lista dei ristoranti -->
        <div class="row">
          <h3 v-if="loading" class="text-center text_orange">Caricamento...</h3>
          <h3 v-if="error" class="text-center text_orange">{{ error }}</h3>

          <div v-if="selectedTypes.length > 0">
            <h5 class="text-white fst-italic">Risultato della Ricerca</h5>
            <p class="text-white">{{ filteredRestaurants.length }} ristoranti</p>
          </div>

          <div v-if="!loading & !error" v-for="restaurant in filteredRestaurants" :key="restaurant.id"
            class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4 d-flex justify-content-center">
            <router-link :to="{ name: 'Menu', params: { restaurantId: restaurant.id} }"
              class="text-decoration-none w-100">

              <div class="card rounded-0 p-1 card-custom shadow-sm">
                <img :src = "restaurant.image" :alt="restaurant.name"
                  class="card-img-top img-fluid" />
                <div class="card-body border border-dark rounded mt-1 px-1 py-2">
                  <h6 class="card-title mb-1">{{ restaurant.name }}</h6>
                  <p class="card-text mb-1 gap-2">
                    <span v-for="type in restaurant.types" :key="type.id" :class="getIconClass(type.name)"
                      :style="{ color: getIconColor(type.name) }" aria-hidden="true" class="me-2">
                    </span>
                  </p>
                  <p class="card-text fs-10 m-0">{{ restaurant.address }}</p>
                  <!-- <router-link
                    :to="{ name: 'Menu', params: { restaurantId: restaurant.id} }"
                    class="btn btn_orange">Vedi Piatti
                  </router-link> -->
                </div>
              </div>

            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

#my_types_container {
  cursor: pointer;
}

.rounded_15 {
  border-radius: 15px;
}

.filters-fixed {
  position: sticky; /* Mantiene l'elemento fisso rispetto al contenitore */
  top: 20px; /* Distanza dalla parte superiore della finestra */
  z-index: 1000; /* Assicura che il filtro sia sopra ad altri elementi */
  height: fit-content; /* Garantisce che occupi solo lo spazio necessario */
}

@media (max-width: 992px) {
  .filters-fixed {
    position: relative;
    top: unset;
    z-index: unset;
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 992px) {
  .card {
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  
      .card-body {
        background-color: rgba(255, 128, 1, 1);
        transition: background-color 0.3s ease;
      }
    }
  }
}

.card {
  border: 2px solid rgba(255, 128, 1, 1);
}


// .card-body {
//   border-bottom-left-radius: 5px;
//   border-bottom-right-radius: 5px;
// }

.text_orange {
  color: rgba(255,128,1,1);
}

.btn_orange {
  color: black;
  background-color: rgba(255,128,1,1);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
  background: rgb(77,20,140);
  color: white;
  transform: translateY(-3px);
  }
}

.fs-10 {
  font-size: 12px;
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
  min-height: 230px;
  // min-width: 200px;
  // max-width: 200px;
}

.card-custom .card-img-top {
  height: 150px; /* Riduce l’altezza dell’immagine */
  object-fit: cover; /* Assicura che l’immagine si adatti senza deformarsi */
}

// .card-custom .card-body {
//   padding: 10px; /* Riduce il padding per una visualizzazione più compatta */
// }

// .card-custom .card-title {
//   font-size: 1.1rem; /* Riduce leggermente la dimensione del titolo */
// }

// .card-custom .card-text {
//   font-size: 0.9rem; /* Riduce la dimensione del testo */
// }

</style>
