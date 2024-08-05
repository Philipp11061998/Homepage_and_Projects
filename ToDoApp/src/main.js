import { createApp } from 'vue';
import App from './App.vue';
import SecondApp from './AppServerSite.vue';
import Login from './Login.vue';

document.addEventListener("DOMContentLoaded", () => {
    const loginApp = createApp(Login);
    const app = createApp(App);
    let headerToDos = document.getElementById("FirstHeader").innerHTML;

    loginApp.mount("#login");

    window.addEventListener('login', () =>{
        //PHP sende LoginDaten an Server und warte Antwort ab muss hier hin
        const { username, password } = event.detail;
        localStorage.setItem('username', JSON.stringify(username));

        // Hier können weitere Aktionen ausgeführt werden, z.B. Anwendung neu laden oder anzeigen
        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        document.getElementById("login").remove();
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
        document.getElementById("login").remove();
        app.mount('#app'); // Neu laden der Vue-Anwendung
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');
    });
    
    window.addEventListener('server', () =>{
        if(localStorage.getItem("login") === "server"){
            localStorage.setItem('login', 'server'); // Login-Status aktualisieren
        }

        const app2 = createApp(SecondApp);
        // Hier können weitere Aktionen ausgeführt werden, z.B. Anwendung neu laden oder anzeigen
        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        document.getElementById("login").remove();
        app2.mount('#app'); // Neu laden der Vue-Anwendung
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username');

    });

    function startTasksApp(){
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