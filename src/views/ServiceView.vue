<template>
  <div class="geo-location">
    <h1>Map and Route Planning</h1>

    <!-- Search location form -->
    <form @submit.prevent="searchLocation">
      <div>
        <label for="location">Search Location:</label>
        <input type="text" v-model="searchQuery" id="location" required placeholder="Enter location name" />
      </div>
      <button type="submit">Search Location</button>
    </form>

    <div>
      <p><strong>Click on the map</strong> to set the starting point and destination:</p>
      <p>Starting Point: {{ startCoordinates }}</p>
      <p>Destination: {{ endCoordinates }}</p>
    </div>

    <!-- Map container -->
    <div id="map" class="map-container"></div>
    <button @click="planRoute" :disabled="!startCoordinates || !endCoordinates">Plan Route</button>
    <button @click="clearRoute" :disabled="!startCoordinates && !endCoordinates">Clear Route</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';

const searchQuery = ref('');
const startCoordinates = ref(null);
const endCoordinates = ref(null);
let map;
let startMarker;
let endMarker;
let routeLayer;

// Set the MapBox API key
mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbTM3MSIsImEiOiJjbHZ4c2N1dmIybjYzMmpxczJhb3dobXltIn0.jy7IYMSqAXfZeGn7eS0d9g';

// Initialize map
const initMap = () => {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [144.9631, -37.8136], // Default center (Melbourne)
    zoom: 12,
  });

  // Map click event for selecting start and end points
  map.on('click', (e) => {
    if (!startCoordinates.value) {
      startCoordinates.value = [e.lngLat.lng, e.lngLat.lat];
      startMarker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(startCoordinates.value)
        .addTo(map);
    } else if (!endCoordinates.value) {
      endCoordinates.value = [e.lngLat.lng, e.lngLat.lat];
      endMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(endCoordinates.value)
        .addTo(map);
    }
  });
};

// Search location function
const searchLocation = () => {
  if (!searchQuery.value) return;

  const currentCenter = map.getCenter(); // Get current map center for proximity search

  // Fetch location based on searchQuery with proximity to current center
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?proximity=${currentCenter.lng},${currentCenter.lat}&access_token=${mapboxgl.accessToken}`)
    .then(response => response.json())
    .then(data => {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      map.flyTo({ center: [longitude, latitude], zoom: 14 });

      if (startMarker) startMarker.remove();
      startMarker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
    })
    .catch(error => {
      console.error('Error searching location:', error);
      alert('Location not found, please try again.');
    });
};

// Plan route function
const planRoute = () => {
  if (!startCoordinates.value || !endCoordinates.value) return;

  // Call MapBox Directions API
  fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates.value.join(',')};${endCoordinates.value.join(',')}.json?geometries=geojson&access_token=${mapboxgl.accessToken}`)
    .then(response => response.json())
    .then(data => {
      const route = data.routes[0].geometry;

      // Remove previous route if exists
      if (routeLayer) {
        map.removeLayer('route');
        map.removeSource('route');
      }

      // Draw the new route
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route,
        },
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
        },
      });

      routeLayer = true; // Track that route is drawn
    })
    .catch(error => {
      console.error('Error planning route:', error);
      alert('Route planning failed, please try again.');
    });
};

// Clear route and markers
const clearRoute = () => {
  // Clear markers
  if (startMarker) startMarker.remove();
  if (endMarker) endMarker.remove();

  // Clear coordinates
  startCoordinates.value = null;
  endCoordinates.value = null;

  // Remove route if exists
  if (routeLayer) {
    map.removeLayer('route');
    map.removeSource('route');
    routeLayer = false;
  }
};

// Initialize the map when the component is mounted
onMounted(() => {
  initMap();
});
</script>

<style scoped>
.geo-location {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

.map-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border: 1px solid #ddd;
}
</style>
