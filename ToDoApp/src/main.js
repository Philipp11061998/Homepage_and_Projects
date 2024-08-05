import { createApp } from 'vue';
import App from './App.vue';
import SecondApp from './AppServerSite.vue';
import Login from './Login.vue';

document.addEventListener("DOMContentLoaded", () => {
    const headerToDos = document.getElementById("FirstHeader").innerHTML;

    const createLoginApp = () => createApp(Login);
    const createAppInstance = () => createApp(App);
    const createSecondAppInstance = () => createApp(SecondApp);

    let loginApp = createLoginApp();
    let app = createAppInstance();
    let app2 = createSecondAppInstance();

    loginApp.mount("#login");

    window.addEventListener('login', (event) => {
        // PHP sende LoginDaten an Server und warte Antwort ab muss hier hin
        const { username, password } = event.detail;
        localStorage.setItem('username', JSON.stringify(username));

        // Hier können weitere Aktionen ausgeführt werden, z.B. Anwendung neu laden oder anzeigen
        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        document.getElementById("login").style.display = "none";
        app.mount('#app'); // Neu laden der Vue-Anwendung
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');
    });

    window.addEventListener('local', () => {
        console.log("Ich werde ausgeführt");

        // Hier wird der Login-Status aktualisiert, falls nicht bereits gesetzt
        if (!localStorage.getItem("login")) {
            localStorage.setItem('login', 'local');
            localStorage.setItem('username', 'Gast');
            document.getElementById("FirstHeader").innerHTML = headerToDos + " Gast";
        }
        // Hier können weitere Aktionen ausgeführt werden, z.B. Anwendung neu laden oder anzeigen
        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        document.getElementById("login").style.display = "none";
        app.mount('#app'); // Neu laden der Vue-Anwendung
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');
    });

    window.addEventListener('server', () => {
        if (localStorage.getItem("login") === "server") {
            localStorage.setItem('login', 'server'); // Login-Status aktualisieren
        }

        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        app2.mount('#app'); // Neu laden der Vue-Anwendung
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');
    });

    window.addEventListener('logout', () => {
        app.unmount(); // Entladen der aktuellen Vue-Anwendung
        loginApp = createLoginApp();
        app = createAppInstance();
        loginApp.mount('#login'); // Neu laden der Vue-Anwendung
        document.getElementById("holder").style.display = "none";
        document.getElementById("login").style.display = "block";

    });

    function startTasksApp() {
        // Fokussieren des Elements
        const newTask = document.getElementById("new_task");
        if (newTask) {
            newTask.focus();
        }

        // Event-Listener für Header hinzufügen
        const header = document.getElementById("FirstHeader");
        if (header) {
            header.addEventListener("dblclick", (event) => event.preventDefault());
            header.addEventListener("mousedown", (event) => event.preventDefault());
            header.addEventListener("click", (event) => event.preventDefault());
        }
    }
});
