import { createApp } from 'vue';
import { emptyLocalStorage, startTasksApp, pullTasksFromDatatable } from '@/main';
import Login from '@/Login.vue';
import SecondApp from '../AppServerSite.vue';

const createLoginApp = () => createApp(Login);
let loginApp = createLoginApp();

const createSecondAppInstance = () => createApp(SecondApp);
let app2 = createSecondAppInstance();

export function autoLoginServer(){
    document.getElementById("login").style.display = "none";
    const headerToDos = document.getElementById("FirstHeader").innerHTML;

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');

    // Sicherstellen, dass sowohl der Benutzername als auch die Benutzer-ID vorhanden sind
    if (!username || !userId) {
        return;
    }

    // Anfrage an die PHP-Datei senden
    fetch('https://philippk.name/ToDoApp/checkCookie.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            console.log('Session ist gültig.');
            // Weitere Aktionen bei erfolgreicher Session
            loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
            app2.mount('#app'); // Neu laden der Vue-Anwendung
            document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
            startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
            document.getElementById("FirstHeader").innerHTML = headerToDos + username.replace(/^"(.+(?="$))"$/, '$1');
            pullTasksFromDatatable(username);
        } else {
            console.error('Session ist nicht gültig:', data.error);
            // Möglicherweise den Benutzer abmelden oder zu einer Login-Seite weiterleiten
            document.getElementById("login").style.display = "block";
            return;
        }
    })
    .catch(error => console.error('Fehler:', error));
}