<template>
    <nav>
        <button id="settings" class="add nav_button" @click="openSettings">Einstellungen</button>
        <button id="logout" class="add nav_button" @click="logout">Logout</button>
    </nav>
    <div v-if="this.Tasklist">
        <label id="new">
            <span @mousedown.prevent>Neue Aufgabe hinzufügen:</span>
            <newT 
            @add-task="handleAddTask"
            />
        </label>
        <div id="holder_tasks">
            <h2 @mousedown.prevent @click="toggleTasks('unfinished')">Nicht erledigte Aufgaben ({{ nichterledigt.length }})</h2>
            <unfinished-tasks :tasks="nichterledigt" 
            @delete-task="handleDeleteTask" 
            @toggle-task-status="handleToggleTaskStatus"
            @update-goal-date="ChangeGoalDate"
            />
            <hr>
            <h2 @mousedown.prevent @click="toggleTasks('finished')">Erledigte Aufgaben ({{ erledigt.length }})</h2>
            <finished-tasks :tasks="erledigt" 
            @delete-task="handleDeleteTask" 
            @toggle-task-status="handleToggleTaskStatus"
            @update-goal-date="ChangeGoalDate"
            />
            <hr>
            <h2 @mousedown.prevent @click="toggleTasks('all')">Alle Aufgaben ({{ tasks.length }})</h2>
            <all-tasks :tasks="tasks"/>
        </div>
    </div>
    <settings v-if="this.settings"
    @notificationToggle="toggleNotificationSetting"
    />
</template>

<script>
import NewTask from "./components/TaskPage/newTask.vue";
import FinishedTasks from "./components/TaskPage/finished_tasks.vue";
import UnfinishedTasks from "./components/TaskPage/unfinished_tasks.vue";
import AllTasks from "./components/TaskPage/all_tasks.vue";
import settings from './components/settings/settings.vue';
import { sendNotification } from "./main";

export default {
    emits: ['addTask', 'updateGoalDate', 'deleteTask', 'toggleTaskStatus'],
    components: {
        newT: NewTask,
        finishedTasks: FinishedTasks,
        unfinishedTasks: UnfinishedTasks,
        allTasks: AllTasks,
        settings
    },
    data() {
        return {
            tasks: [],
            visibility: {
                all: false,
                finished: false,
                unfinished: true,
            },
            settings: false,
            Tasklist: true,
            notificationSetting: false,
            intervalId: null 
        };
    },
    created(){
        this.startChecking();
    },  
    watch: {
        notificationSetting(newVal) {
            localStorage.setItem('notificationSetting', newVal); // Speichern des neuen Werts
        }
    },
    mounted() {
        const vis = localStorage.getItem("visibility");
        window.vueInstance = this;

        if (vis){
            this.visibility = JSON.parse(vis);
            if(this.visibility.all){
               document.getElementById("all").style.display = "block";
            }if(this.visibility.finished){
               document.getElementById("finished").style.display = "block"; 
            }if(this.visibility.unfinished){
               document.getElementById("unfinished").style.display = "block";
            }
        }

        this.$nextTick(() => {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
                console.log("Tasks wurden geladen");
            } else {
                console.log("Keine Tasks im LocalStorage gefunden.");
            }
        });

        if(!localStorage.getItem("notificationSetting")){
            localStorage.setItem("notificationSetting", false);
        }
    },
    methods: {
        FinOrUnfinTaskToggle(){
            localStorage.setItem("task", JSON.stringify(this.tasks));
        },
        toggleTasks(id) {
            const allTasks = document.getElementById(id);
            if (allTasks.style.display === "block") {
                allTasks.style.display = "none";
                console.log(JSON.stringify(this.visibility));
                this.visibility[id] = !this.visibility[id];
                localStorage.setItem("visibility", JSON.stringify(this.visibility));
                } else {
                allTasks.style.display = "block";
                this.visibility[id] = !this.visibility[id];
                localStorage.setItem("visibility", JSON.stringify(this.visibility));
            }
        },
        logout(){
            document.getElementById("holder").style.display = "none";
            document.getElementById("login").style.display = "none";
            location.reload();
            document.getElementById("FirstHeader").innerHTML = "To-do-Liste von ";
            localStorage.setItem('login', '');
            localStorage.removeItem('tasks', '');
            localStorage.removeItem('user_id', '');
            localStorage.removeItem('username', '');
            localStorage.removeItem('visibility', '');
        },
        openSettings(){
            this.Tasklist = !this.Tasklist;
            this.settings = !this.settings;
        },
        handleAddTask(newTaskDescription) {
            const newTask = {
                beschreibung: newTaskDescription,
                fertig: false, // Standardmäßig nicht fertig
                user_id: localStorage.getItem('user_id'),
            };
            
            // Füge die neue Aufgabe zu den lokalen Aufgaben hinzu
            this.tasks.push(newTask); 
            
            // Update local storage
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            
            // Speichere nur die neue Aufgabe auf dem Server
            this.saveTask(newTask);
        }, 
        async ChangeGoalDate( taskId, goalDate ) {
            console.log('Task ID:', taskId);
            console.log('Goal Date:', goalDate);
            
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            // Aufgabe finden
            const task = this.tasks.find(t => t.id === taskId);
            
            if (!task) {
                console.error('Aufgabe nicht gefunden');
                return;
            }

            // Zieldatum aktualisieren
            task.Goal_Date = goalDate;

            console.log(task);

            // Aufgabe speichern
            await this.handleUpdateTask(task);
        },
        async saveTask(task) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            try {
                const response = await fetch('https://philippk.name/ToDoApp/save_tasks.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: userId, tasks: [task] })
                });
                const data = await response.json();

                if (data.success) {
                    console.log('Task erfolgreich gespeichert');
                    this.refreshTasks();
                } else {
                    console.error('Fehler beim Speichern der Task:', data.error);
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        },
        async handleDeleteTask(taskId) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            // Entferne die Aufgabe aus dem lokalen Array
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(this.tasks));

            try {
                const response = await fetch('https://philippk.name/ToDoApp/delete_tasks.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        tasks: [
                            {
                                id: taskId,
                                beschreibung: "", // Falls erforderlich
                                fertig: false // Falls erforderlich
                            }
                        ]
                    })
                });
                const data = await response.json();

                if (data.success) {
                    console.log('Task erfolgreich gelöscht');
                } else {
                    console.error('Fehler beim Löschen der Task:', data.error);
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        },
        async handleToggleTaskStatus(taskId) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            // Finde die Aufgabe und toggle den Status
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.fertig = !task.fertig;
                this.handleUpdateTask(task);
            }
        },
        async handleUpdateTask(task) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            // Aktualisiere die Aufgabe im lokalen Array
            const taskIndex = this.tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = task;
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }

            try {
                const response = await fetch('https://philippk.name/ToDoApp/update_tasks.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: userId, tasks: [task] })
                });
                const data = await response.json();

                if (data.success) {
                    console.log('Task erfolgreich aktualisiert');
                } else {
                    console.error('Fehler beim Aktualisieren der Task:', data.error);
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        },
        async refreshTasks() {
            const userId = localStorage.getItem('user_id');
            const username = localStorage.getItem('username');

            try {
                const tasksResponse = await fetch(`https://philippk.name/ToDoApp/tasks.php?user_id=${userId}&username=${encodeURIComponent(username)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const tasksData = await tasksResponse.json();

                if (Array.isArray(tasksData)) {
                    localStorage.setItem('tasks', JSON.stringify(tasksData));
                    this.tasks = tasksData;
                } else {
                    console.error('Fehler beim Abrufen der Aufgaben:', tasksData.error);
                }
            } catch (error) {
                console.error('Fehler:', error);
            }
        },
        toggleNotificationSetting(){
            console.log("Notification Toggle Changed")
            this.notificationSetting = !this.notificationSetting;
            localStorage.setItem("notificationSetting", this.notificationSetting);
        },
        startChecking() {
            // Wenn bereits ein Intervall existiert, stoppe es nicht, da es dauerhaft laufen soll
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }

            // Starte ein neues Intervall, um jede Minute zu prüfen
            this.intervalId = setInterval(() => {
                this.checkDates();
            }, 60000); // Alle 60.000 Millisekunden (1 Minute)
        },
        checkDates() {
            console.log('checkDates Methode aufgerufen');
            const now = new Date();
            console.log('Aktuelles Datum und Uhrzeit:', now);

            const taskliste = this.tasks.nichterledigt();

            this.tasks.forEach(task => {
                if (task.Goal_Date) {
                    // Zerlege das Datum und die Zeit
                    const [datePart, timePart] = task.Goal_Date.split(', ').map(part => part.trim());
                    console.log('Datumsteil:', datePart);
                    
                    // Bereinige den Zeitteil
                    const cleanedTimePart = timePart.replace(/[^0-9:]/g, '');
                    console.log('Gesäuberter Zeitteil:', cleanedTimePart);

                    // Teile das Datum und die Zeit in Einzelkomponenten auf
                    const [day, month, year] = datePart.split('.').map(Number);
                    const [hours, minutes] = cleanedTimePart.split(':').map(Number);

                    console.log('Tag:', day);
                    console.log('Monat:', month);
                    console.log('Jahr:', year);
                    console.log('Stunden:', hours);
                    console.log('Minuten:', minutes);

                    // Überprüfe auf ungültige Werte
                    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
                        console.error('Einer der Datumsteile ist ungültig.');
                        return;
                    }

                    // Erstelle das Ziel-Datum
                    const goalDate = new Date(year, month - 1, day, hours, minutes);
                    console.log('Berechnetes Ziel-Datum:', goalDate);

                    // Überprüfe, ob das Datum gültig ist und vergleiche es mit dem aktuellen Datum
                    if (isNaN(goalDate.getTime())) {
                        console.error('Das berechnete Ziel-Datum ist ungültig.');
                    } else if (now >= goalDate) {
                        console.log(`Ziel-Datum für Aufgabe ${task.id} erreicht oder überschritten`);
                        sendNotification("Dein ToDo ist fällig!", "Folgendes ToDo ist fällig:  \n" + task.beschreibung)
                    }
                }
            });
        },
    },
    computed: {
        nichterledigt() {
            return this.tasks.filter(task => !task.fertig);
        },
        erledigt() {
            return this.tasks.filter(task => task.fertig);
        }
    },
    beforeDestroy() {
        // Stoppe das Intervall, wenn die Komponente zerstört wird, um Speicherlecks zu vermeiden
        if (this.intervalId) {
        clearInterval(this.intervalId);
        }
    }
};
</script>


<style scoped>
    h2 {
        cursor: pointer;
    }

    #all,
    #finished {
        display: none;
    }

    #new{
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        font-size: 2.5rem;
    }

    #finished,
    #unfinished,
    #all{
        text-align: left;
        width: 92%;
        padding-left: 0;
    }

    #holder_tasks{
        border: 1.9px solid black;
        border-radius: 1.7rem;
        width: 80vw;
        background-color: rgb(253, 253, 137);
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center; 
        justify-content: center; 
    }

    hr{
        text-align: center;
        width: 90%;
        opacity: .4;
    }

    @media only screen and (max-width: 530px) {
    #new{
        font-size: 1.5rem;
    }
}

    @media only screen and (min-width: 800px) and (max-width: 1099px) {
        #holder_tasks{
            width: 70vw;
            max-width: 1900px;
        }
    }

    @media only screen and (min-width: 1100px) {
        #holder_tasks{
            width: 60vw;
            max-width: 1750px;
        }
    }
</style>
