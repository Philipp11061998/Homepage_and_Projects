import { createApp } from 'vue';
import Login from '../Login.vue';
import App from '../App.vue';
import { startTasksApp } from '@/main';


const createLoginApp = () => createApp(Login);
let loginApp = createLoginApp();

const createAppInstance = () => createApp(App);
let app = createAppInstance();

export function localLogin(){
    const headerToDos = document.getElementById("FirstHeader").innerHTML;

    console.log("Ich werde ausgeführt");
    localStorage.setItem('login', 'local');
    localStorage.setItem('username', 'Gast');
    document.getElementById("FirstHeader").innerHTML = headerToDos + " Gast";

    // Hier können weitere Aktionen ausgeführt werden, z.B. Anwendung neu laden oder anzeigen
    loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
    document.getElementById("login").style.display = "none";
    app.mount('#app'); // Neu laden der Vue-Anwendung
    document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
    startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
    document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');
}