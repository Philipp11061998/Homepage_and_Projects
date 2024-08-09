import { createApp } from 'vue';
import { startTasksApp, emptyLocalStorage, pullTasksFromDatatable } from "@/main";
import SecondApp from '../AppServerSite.vue';
import Login from '@/Login.vue';

const createLoginApp = () => createApp(Login);
let loginApp = createLoginApp();

const createSecondAppInstance = () => createApp(SecondApp);
let app2 = createSecondAppInstance();

const headerToDos = document.getElementById("FirstHeader").innerHTML;

export async function loginToServer(username, password) {
    const headerToDos = document.getElementById("FirstHeader").innerHTML;

    if (username && typeof username === 'string' && username.length > 0) {
        localStorage.setItem('username', username.replace(/^"(.+(?="$))"$/, '$1'));
        console.log("Username gespeichert:", localStorage.getItem('username'));
    } else {
        console.error("Ungültiger Username:", username);
        return;
    }

    const loginSuccess = await handleLogin(username, password);

    // Wenn der Login nicht erfolgreich war, abbrechen
    if (!loginSuccess) {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        return;
    }
}


export function handleLogin(username, password) {
    return fetch('https://philippk.name/ToDoApp/login.php', {
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
            // Erfolgreicher Login
            emptyLocalStorage();
            localStorage.setItem('login', 'server');
            localStorage.setItem('user_id', data.user_id);
            //pullTasks ist notwendig, da nur dort das setten des usernames in den
            //LocalStorage funktioniert hat. Das ist notwendig um beim neuladen der Seite
            //Das Server Event richtig auszuführen
            pullTasksFromDatatable(username);
            location.reload();
            return true; // Erfolgreicher Login
        } else if (data.error) {
            console.error('Login fehlgeschlagen:', data.error);
            alert(data.error);
            return false; // Login fehlgeschlagen
        }
    })
    .catch(error => {
        console.error('Fehler bei der Anfrage:', error);
        return false; // Fehler bei der Anfrage
    });
}

