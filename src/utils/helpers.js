// funzione toggle per le tipologie
export function toggleType(context, type) {
  if (context.selectedTypes.includes(type)) {
    context.selectedTypes = context.selectedTypes.filter(t => t !== type);
  } else {
    context.selectedTypes.push(type);
  }
}

// funzione per filtrare i ristoranti
export function filterRestaurants(restaurants, selectedTypes, searchTerm) {
    if (selectedTypes.length === 0 && searchTerm === '') {
      return restaurants;
    } else if (selectedTypes.length > 0) {
      return restaurants.filter(restaurant =>
        restaurant.types.some(type => selectedTypes.includes(type.name))
      );
    } else {
      const search = searchTerm.toLowerCase();
      return restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(search)
      );
    }
}

// funzione per definire le icone
export function getIconClass(type) {
  const icons = {
    Italiano: "fas fa-pizza-slice fa-sm",
    Giapponese: "fas fa-fish fa-sm",
    Messicano: "fas fa-pepper-hot fa-sm",
    Indiano: "fas fa-drumstick-bite fa-sm",
    Vegetariano: "fas fa-leaf fa-sm",
    Americano: "fas fa-hamburger fa-sm",
    Cinese: "fas fa-cloud-meatball fa-sm",
    Francese: "fas fa-bread-slice fa-sm",
    Tailandese: "fas fa-utensils fa-sm",
    Mediterraneo: "fas fa-sun fa-sm",
  };
  return icons[type];
}

// funzione per il colore delle icone
export function getIconColor(type) {
  const colors = {
    Italiano: "#D08100",
    Cinese: "#e64a19",
    Giapponese: "#0080D0",
    Messicano: "#D00100",
    Indiano: "#ff9800",
    Vegetariano: "#4caf50",
    Americano: "#CC6400",
    Francese: "#fbc02d",
    Tailandese: "#A6A6A6",
    Mediterraneo: "#E3BB01",
  };
  return colors[type];
}