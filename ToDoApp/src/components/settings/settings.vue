<template>
    <ul id="settingsForm">
        <div class="leftRow">
            <button @click="setVisibility('general')" :class="{ active: visibilitys.general }">
                Allgemeine Einstellungen
                <hr id="betweenSettings">
            </button>
            <button @click="setVisibility('notifications')" :class="{ active: visibilitys.notifications }">
                Benachrichtigungen
                <hr id="betweenSettings">
            </button>
        </div>
        <hr>
        <div class="rightRow">
            <div v-if="visibilitys.general" class="rightRowitem">
                Hier werden Allgemeine Einstellungen entstehen. Aktuell gibt es noch keine Auswahlmöglichkeiten.
            </div>
            <div v-if="visibilitys.notifications" class="rightRowitem">
                <div id="switch">
                    Aktiviert 
                    <label class="switch">
                        <input type="checkbox" :checked="!notifications" @change="toggleNotification">
                        <span class="slider round"></span>
                    </label> 
                    Deaktiviert
                </div>
            </div>
        </div>
    </ul>
</template>


<script>

import { sendNotification } from '../../main.js';

export default {
    data() {
        return {
            visibilitys: {
              general: true,
              notifications: false  
            }
        };
    },
    mounted(){
        this.$nextTick(() => {
        const notifVis = JSON.parse(localStorage.getItem("notificationSetting"));
        if (notifVis !== null) {
            this.visibilitys.notifications = notifVis;
        }
    });
    },
    methods: {
        setVisibility(section) {
            // Alle Einträge in visibilitys auf false setzen
            for (let key in this.visibilitys) {
                if (this.visibilitys.hasOwnProperty(key)) {
                    this.visibilitys[key] = false;
                }
            }
            // Das spezifische Feld auf true setzen
            if (this.visibilitys.hasOwnProperty(section)) {
                this.visibilitys[section] = true;
            }
        },
        async toggleNotification() {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.notifications = !this.notifications;
                localStorage.setItem("notificationSetting", JSON.stringify(this.notifications));
                
                console.log("Benachrichtigungen", this.notifications ? "aktiviert" : "deaktiviert");
                if (this.notifications) {
                    sendNotification('Benachrichtigungen aktiviert', 'Wir benachrichtigen dich sobald eines der ToDos, die ein Ziel haben, fällig sind.');
                }
            } else if (permission === "denied") {
                console.log('Benachrichtigungen wurden nicht aktiviert.');
            }
        },
     }
};
</script>

<style scoped>
    #settingsForm{
        display: flex;
        position: relative;
        flex-direction: row;
        min-width: fit-content;
        overflow: hidden;
        max-width: 500px !important;
        background-color: rgb(178, 166, 166);
        border-radius: 5rem;
        -webkit-box-shadow: 5px 6px 15px 5px rgba(0,0,0,0.54); 
        box-shadow: 5px 6px 15px 5px rgba(0,0,0,0.54);
        gap: 1rem;
        justify-content: space-evenly;
        padding: 2rem;
        padding-top: 1rem;
    }

    .leftRow{
        border-radius: 1rem;
        text-align: start;
        padding-left: 1.5rem;
        width: fit-content;
    }

    button{
        border: none;
        font-size: 1.3rem;
        background: none;
        width: 90%;
        text-align: start;
        cursor: pointer;
        margin-top: 1rem;
    }

    .rightRow{
        width: fit-content;
        max-width: 400px;
        margin-top: 1rem;
        padding-right: 1.5rem;
        text-align: start;
        display: flex;
        align-items: center;
    }

    hr {
        position: absolute;
        height: 1.5px !important;
        width: 90% !important;
        background-color: black;
        border: none;
        margin: 0;
        transform: rotate(90deg);
    }
    
    #betweenSettings {
        position: relative;
        margin-top: 0.5rem;
        height: 1px;
        width: 80% !important;
        background-color: black;
        border: none;
        box-sizing: border-box;
        transform: rotate(0deg) !important;
    }

    .rightRowitem{
        margin-left: 1.5rem;
    }

    #switch {
    background: none;
    box-shadow: none;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:not(:checked) + .slider {
        background-color: #2196F3;
    }

    input:checked + .slider {
        background-color: #ccc;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    input:not(:checked) + .slider:before {
        transform: translateX(0);
    }

</style>
