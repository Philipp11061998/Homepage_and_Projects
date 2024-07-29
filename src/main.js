import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import App2 from './contact.vue'

// Bootstrap CSS importieren
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap JS importieren
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

let appInstance = createApp(App).mount('#app');

function switchApp(app) {

  switch(app) {
    case 'contact':
      appInstance = createApp(App2).mount('#app');
      break;
    case 'home':
      appInstance = createApp(App).mount('#app');
      break;
    default:
      appInstance = createApp(App).mount('#app');
      break;
  }
}

// Event-Listener hinzufügen
window.addEventListener("contact", function() {
  switchApp('contact');
});

window.addEventListener("home", function() {
  switchApp('home');
});

export { switchApp };
