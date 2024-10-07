import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// 你已经注释掉了主题和样式导入，根据需要再添加回来
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Vue app
const app = createApp(App);
app.use(PrimeVue);
app.component('DataTable', DataTable);
app.component('PrimeColumn', Column);

// Import and initialize Firebase
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyDjZEr85ha51yAgv7wIFY6o9s1YtgKrqCc",
    authDomain: "new-week7.firebaseapp.com",
    projectId: "new-week7",
    storageBucket: "new-week7.appspot.com",
    messagingSenderId: "512699226462",
    appId: "1:512699226462:web:e7d64810904fb3109c17cf",
    measurementId: "G-LVMH1Q8BLN"
};
initializeApp(firebaseConfig);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router);
app.mount('#app');
