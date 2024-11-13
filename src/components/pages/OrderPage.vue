<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      totalOrders: 0,
      totalRevenue: 0,
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:8000/api/orders');
        this.orders = response.data.orders;
        this.totalOrders = response.data.totalOrders;
        this.totalRevenue = response.data.totalRevenue;
      } catch (error) {
        console.error('Errore nel recupero degli ordini:', error);
      }
    },
  },
};
</script>
<template>
    <div class="orders-container">
      <h2>Statistiche Ordini</h2>
      <div class="stats">
        <p><strong>Totale Ordini:</strong> {{ totalOrders }}</p>
        <p><strong>Entrate Totali:</strong> €{{ totalRevenue.toFixed(2) }}</p>
      </div>
  
      <h3>Elenco Ordini</h3>
      <div v-if="orders.length === 0">
        <p>Nessun ordine trovato.</p>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Nome Cliente</th>
              <th>Cognome Cliente</th>
              <th>Indirizzo di Spedizione</th>
              <th>Totale Prezzo</th>
              <th>Data</th>
              <th>Piatti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.customer_surname }}</td>
              <td>{{ order.shipping_address }}</td>
              <td>€{{ order.total_price.toFixed(2) }}</td>
              <td>{{ order.created_at }}</td>
              <td>
                <ul>
                  <li v-for="orderDish in order.order_dishes" :key="orderDish.id">
                    {{ orderDish.dish.name }} (x{{ orderDish.quantity }})
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .orders-container {
    padding: 20px;
    height: 75vh;
    color: white;
    max-width: 1330px;
    margin: 0 auto;
  }
  
  .stats {
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th, table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  </style>
  