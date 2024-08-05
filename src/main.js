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

function sendDataToServer(data) {
  fetch('https://philippk.name/contact.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Teste zunächst mit response.text()
  })
  .then(responseText => {
      console.log('Raw server response:', responseText);
      return JSON.parse(responseText); // Versuche, die Antwort manuell zu parsen
  })
  .then(responseData => {
      console.log('Parsed server response:', responseData);
  })
  .catch(error => {
      console.error('Fehler:', error);
  });
}


window.addEventListener('send_Contact', () => {
  const nameValue = document.getElementById('name').value;
  let emailValue = "Keine Emailadresse angegeben";

  if (document.getElementById('mail').value){
    emailValue = document.getElementById('mail').value;
  }

  const messageValue = document.getElementById('message').value

  const data = {
    name: nameValue,
    email: emailValue,
    message: messageValue
  }

  sendDataToServer(data);

  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("message").value = "";

  document.getElementById("success").innerText = "Deine Nachricht wurde erfolgreich übermittelt :)";

});


