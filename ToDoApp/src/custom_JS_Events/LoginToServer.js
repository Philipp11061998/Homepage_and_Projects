import { createApp } from 'vue';
import { handleLogin } from "@/main";
import Login from '../Login.vue';
import SecondApp from '../AppServerSite.vue';
import { startTasksApp } from '@/main';

const createLoginApp = () => createApp(Login);
let loginApp = createLoginApp();

const createSecondAppInstance = () => createApp(SecondApp);
let app2 = createSecondAppInstance();

const headerToDos = document.getElementById("FirstHeader").innerHTML;


export function login(eventData) {
    let { username, password } = eventData.detail;

    localStorage.setItem('username', username);
    localStorage.setItem('login', 'server');


    if(!handleLogin(username, password)){
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        return;
    };   
    
    loginApp.unmount(); // Entladen der aktuellen Vue-Anwendung
    document.getElementById("login").style.display = "none";
    document.getElementById('holder').style.display = "block"; // Einblenden eines bestimmten Elements
    startTasksApp(); // Starten einer anderen Funktion oder Anwendungsteil
    document.getElementById("FirstHeader").innerHTML = headerToDos + localStorage.getItem('username').replace(/^"(.+(?="$))"$/, '$1');
    app2.provide('loginData', { username, password });
    app2.mount('#app');
    console.log('Application successfully updated');
}