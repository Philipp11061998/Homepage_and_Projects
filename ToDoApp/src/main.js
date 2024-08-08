import { createApp } from 'vue';
import App from './App.vue';
import SecondApp from './AppServerSite.vue';
import Login from './Login.vue';
import { login } from './custom_JS_Events/LoginToServer';

document.addEventListener("DOMContentLoaded", () => {
    const headerToDos = document.getElementById("FirstHeader").innerHTML;

    const createLoginApp = () => createApp(Login);
    const createAppInstance = () => createApp(App);
    const createSecondAppInstance = () => createApp(SecondApp);

    let loginApp = createLoginApp();
    let app = createAppInstance();
    let app2 = createSecondAppInstance();

    loginApp.mount("#login");

    if (document.getElementById("username_reg")) {
        document.getElementById("username_reg").addEventListener("keyup", () => {
            let userInputElement = document.getElementById("username_reg"); // Direktes Elementreferenz
            let userInput = userInputElement.value; // Wert des Elements
    
            if (userInput.length > 3) {
                userInputElement.style.borderColor = "green"; // Direktes Styling des Elements
            } else {
                userInputElement.style.borderColor = "red"; // Direktes Styling des Elements
            }
        });
    }
    
    //Wird bei aktivem Login ausgeführt (wenn User auf einloggen klickt). Siehe Server
    //für auto Login über localStorage
    window.addEventListener('login', (event) => {
        login(event);
    });

    window.addEventListener('registry', (event) => {
        let { username, password } = event.detail;
    
        localStorage.setItem('login', 'server');
        console.log('Login status set in localStorage');
    
        if (!checkUsername(username) && username.length > 3) {
            alert("Der Username ist bereits vergeben.");
            return;
        } else if (username.length <= 3) {
            alert("Bitte wähle einen Usernamen der länger als 3 Zeichen ist.");
            return;
        }
    
        if (!handleRegister(username, password)) {
            console.log('Registration failed');
            document.getElementById("username_reg").value = "";
            document.getElementById("password_Reg").value = "";
            return;
        }
    
        localStorage.setItem('username', JSON.stringify(username));

        console.log('Username set in localStorage:', username);

        loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
        document.getElementById("login").style.display = "none";
        app2.provide('loginData', { username, password });
        app2.mount('#app');
        document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
        startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
        document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username').replace(/^"(.+(?="$))"$/, '$1');
        console.log('Application successfully updated');
    });
    
    window.addEventListener('local', () => {
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
    });

    //Auto Login über Local Storage
    window.addEventListener('server', () => {

        document.getElementById("login").style.display = "none";

        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        const local = new CustomEvent('local', {});

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
                emptyLocalStorage();
                console.log('Session ist gültig.');
                // Weitere Aktionen bei erfolgreicher Session
                loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
                app2.mount('#app'); // Neu laden der Vue-Anwendung
                document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
                startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
                document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username').replace(/^"(.+(?="$))"$/, '$1');
                pullTasksFromDatatable();

            } else {
                console.error('Session ist nicht gültig:', data.error);
                // Möglicherweise den Benutzer abmelden oder zu einer Login-Seite weiterleiten
                document.getElementById("login").style.display = "block";
                return;
            }
        })
        .catch(error => console.error('Fehler:', error));
        
    });

    window.addEventListener('logout', () => {
        app.unmount(); // Entladen der aktuellen Vue-Anwendung
        loginApp = createLoginApp();
        app = createAppInstance();
        loginApp.mount('#login'); // Neu laden der Vue-Anwendung
        document.getElementById("holder").style.display = "none";
        document.getElementById("login").style.display = "block";

    }); 

});


export function handleRegister(username, password) {
    return fetch('https://philippk.name/ToDoApp/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Antwort:', data); // Debug-Ausgabe der Antwort
        
        // Überprüfe, ob der Erfolg gemeldet wird und ob user_id vorhanden ist
        if (data.user_id) {
            emptyLocalStorage();
            console.log('Registrierung erfolgreich. User ID:', data.user_id);
            localStorage.setItem('user_id', data.user_id); // Speichern der user_id
            return true;
        } else if (data.error) {
            console.error('Registrierung fehlgeschlagen:', data.error);
            alert(data.error); // Zeigt die Fehlermeldung als Benutzerbenachrichtigung an
            return false;
        } else {
            console.error('Unbekannter Fehler:', data);
            return false;
        }
    })
    .catch(error => {
        console.error('Fehler beim Registrieren:', error);
        return false;
    });
}   


export function handleLogin(username, password) {
    fetch('https://philippk.name/ToDoApp/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'username': username,
            'password': password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user_id) {
            emptyLocalStorage();
            localStorage.setItem('user_id', data.user_id);
            // Weiterleitung oder Aktualisierung der Ansicht
            console.log('Login erfolgreich.', 'User-ID: ', data.user_id);
            pullTasksFromDatatable();
        } else if (data.error) {
            console.error('Login fehlgeschlagen:', data.error);
            alert(data.error); // Zeigt die Fehlermeldung als Benutzerbenachrichtigung an
            return false;
        } else {
            console.error('Unbekannte Antwort vom Server:', data);
        }
    })
    .catch(error => {
        console.error('Fehler bei der Anfrage:', error);
    });
}

export function startTasksApp() {
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

export function pullTasksFromDatatable() {
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    console.log("userID: " + userId);
    console.log("username" + username)

    fetch(`https://philippk.name/ToDoApp/tasks.php?user_id=${userId}&username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data) && data.length === 0) {
            console.log('Keine Tasks vorhanden');
        } else if (data.error) {
            console.error('Fehler:', data.error);
        } else {
            // Aufgaben im LocalStorage speichern
            localStorage.setItem('tasks', JSON.stringify(data));
        }
    })
    .catch(error => console.error('Fehler:', error));
}   


export async function checkUsername(username) {
    try {
        const response = await fetch('https://philippk.name/ToDoApp/checkUsername.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        });
        const data = await response.json();
        return !data.exists; // Wenn `data.exists` true ist, ist der Username vergeben, also geben wir `false` zurück
    } catch (error) {
        console.error('Fehler:', error);
        return false; // Im Fehlerfall gehen wir davon aus, dass der Username nicht verfügbar ist
    }
} 

export function emptyLocalStorage(){
    localStorage.setItem('login', '');
    localStorage.removeItem('tasks', '');
    localStorage.removeItem('user_id', '');
    localStorage.removeItem('username', '');
    localStorage.removeItem('visibility', '');
}