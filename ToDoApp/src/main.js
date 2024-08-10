import { createApp } from 'vue';
import Login from './Login.vue';
import { loginToServer } from './custom_JS_Events/LoginToServer';
import { registerToServer } from './custom_JS_Events/RegisterToServer';
import { localLogin } from './custom_JS_Events/localLogin';
import { autoLoginServer } from './custom_JS_Events/autoLoginServer';

const createLoginApp = () => createApp(Login);

let loginApp = createLoginApp();

document.addEventListener("DOMContentLoaded", () => {
    loginApp.mount("#login");

    const username = document.getElementById("username");

    if (username) {
        username.focus();
    }

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
        let { username, password } = event.detail;
        loginToServer(username, password);
    });

    window.addEventListener('registry', (event) => {
        let { username, password } = event.detail;
        registerToServer(username, password);
    });
    
    window.addEventListener('local', () => {
        localLogin();
    });

    //Auto Login über Local Storage
    window.addEventListener('server', () => {
        autoLoginServer();
    });
});

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

export async function pullTasksFromDatatable(username) {
    const userId = localStorage.getItem('user_id');
    localStorage.setItem("username", username);

    console.log("userID: " + userId);
    console.log("username: " + username);

    try {
        const response = await fetch(`https://philippk.name/ToDoApp/tasks.php?user_id=${userId}&username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length === 0) {
            console.log('Keine Tasks vorhanden');
        } else if (Array.isArray(data) && data.length !== 0) {
            console.log("Tasks vorhanden");
            localStorage.setItem('tasks', JSON.stringify(data));
        } else if (data.error) {
            console.error('Fehler:', data.error);
        } else {
            // Aufgaben im LocalStorage speichern
            localStorage.setItem('tasks', JSON.stringify(data));
        }
    } catch (error) {
        console.error('Fehler:', error);
    }
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