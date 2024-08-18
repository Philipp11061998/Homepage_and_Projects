import { checkUsername, startTasksApp, emptyLocalStorage } from "@/main";
import { createApp } from 'vue';
import SecondApp from '../AppServerSite.vue';

const createSecondAppInstance = () => createApp(SecondApp);
let app2 = createSecondAppInstance();

const headerToDos = document.getElementById("FirstHeader").innerHTML;

export async function registerToServer(username, password){    

    if (!checkUsername(username) && username.length > 3) {
        alert("Der Username ist bereits vergeben.");
        return;
    } else if (username.length <= 3) {
        alert("Bitte wähle einen Usernamen der länger als 3 Zeichen ist.");
        return;
    }

    const registerSuccess = await handleRegister(username, password);

    // Wenn der Login nicht erfolgreich war, abbrechen
    if (!registerSuccess) {
        document.getElementById("username_reg").value = "";
        document.getElementById("password_Reg").value = "";
        return;
    }
    
}

export async function handleRegister(username, password) {
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
            localStorage.setItem('login', 'server');
            console.log('Registrierung erfolgreich. User ID:', data.user_id);
            localStorage.setItem('user_id', data.user_id); // Speichern der user_id
            localStorage.setItem("username", username);
            document.getElementById("login").style.display = "none";
            app2.mount('#app');
            app2.provide('loginData', { username, password });
            document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
            document.getElementById("FirstHeader").innerHTML = headerToDos + username.replace(/^"(.+(?="$))"$/, '$1');
            console.log('Application successfully updated');
            startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
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
        alert("Registrierung fehlgeschlage. Bitte versuche es erneut oder wähle einen anderen Benutzernamen.")
        document.getElementById("username_reg").value = "";
        document.getElementById("password_Reg").value = "";
        return false;
    });
}   
