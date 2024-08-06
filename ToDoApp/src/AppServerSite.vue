<template>
    <nav>
        <button id="profile" class="add nav_button" @click="notCoded">Profil</button>
        <button id="logout" class="add nav_button" @click="logout">Logout</button>
    </nav>
    <div>
        <label id="new"><span @mousedown.prevent>Neue Aufgabe hinzufügen:</span>
            <newT @add-task="handleAddTask"/>
        </label>
        <div id="holder_tasks">
            <h2 @mousedown.prevent @click="toggleTasks('unfinished')">Nicht erledigte Aufgaben ({{ nichterledigt.length }})</h2>
            <unfinished-tasks :tasks="nichterledigt" @delete-task="handleDeleteTask" @toggle-task-status="handleToggleTaskStatus"/>

            <hr>
            
            <h2 @mousedown.prevent @click="toggleTasks('finished')">Erledigte Aufgaben ({{ erledigt.length }})</h2>
            <finished-tasks :tasks="erledigt" @delete-task="handleDeleteTask" @toggle-task-status="handleToggleTaskStatus"/>

            <hr>

            <h2 @mousedown.prevent @click="toggleTasks('all')">Alle Aufgaben ({{ tasks.length }})</h2>
            <allTasks :tasks="tasks"/>
        </div>
    </div>
</template>

<script>
import NewTask from "./components/TaskPage/newTask.vue";
import FinishedTasks from "./components/TaskPage/finished_tasks.vue";
import UnfinishedTasks from "./components/TaskPage/unfinished_tasks.vue";
import AllTasks from "./components/TaskPage/all_tasks.vue"


export default {
    components: {
        newT: NewTask,
        finishedTasks: FinishedTasks,
        unfinishedTasks: UnfinishedTasks,
        allTasks: AllTasks
    },
    data() {
        return {
            tasks: [],
            visibility: {
                all: false,
                finished: false,
                unfinished: true
            }
        };
    },
    mounted() {
        const vis = localStorage.getItem("visibility");

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

        const userId = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
    
        if (!userId || !username) {
            console.error('Benutzer-ID oder Benutzername fehlt');
            return;
        }
    
        fetch(`https://philippk.name/ToDoApp/tasks.php?user_id=${userId}&username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    console.log('Keine Tasks vorhanden');
                } else {
                    // Aufgaben im LocalStorage speichern
                    localStorage.setItem('tasks', JSON.stringify(data));
                    
                    // Tasks in this.tasks pushen
                    this.tasks = data;  // Aktualisiert `this.tasks` mit den erhaltenen Daten
                }
            } else if (data.error) {
                console.error('Fehler:', data.error);
            }
        })
        .catch(error => console.error('Fehler:', error));
    },
    methods: {
        handleAddTask(taskDescription) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('Benutzer-ID fehlt');
                return;
            }

            // Erstellen eines Task-Objekts
            const task = {
                beschreibung: taskDescription,
                fertig: false, // Neue Aufgaben sind standardmäßig nicht fertig
                user_id: userId
            };

            // Hinzufügen des neuen Tasks zum Aufgaben-Array
            this.tasks.push(task);

            // Aufgaben an den Server senden
            this.sendTasksToServer(userId, this.tasks);
        },
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
        handleDeleteTask(array, index) {
            if (array === "unfinished") {
                const taskIndex = this.tasks.findIndex(task => !task.fertig && task.beschreibung === this.nichterledigt[index].beschreibung);
                if (taskIndex > -1) {
                    this.tasks.splice(taskIndex, 1);
                }
            } else if (array === "finished") {
                const taskIndex = this.tasks.findIndex(task => task.fertig && task.beschreibung === this.erledigt[index].beschreibung);
                if (taskIndex > -1) {
                    this.tasks.splice(taskIndex, 1);
                }
            }
            localStorage.setItem("task", JSON.stringify(this.tasks));
        },
        handleToggleTaskStatus(array, index) {
            if (array === "unfinished") {
                const taskIndex = this.tasks.findIndex(task => !task.fertig && task.beschreibung === this.nichterledigt[index].beschreibung);
                if (taskIndex > -1) {
                    this.tasks[taskIndex].fertig = !this.tasks[taskIndex].fertig
                }
            } else if (array === "finished") {
                const taskIndex = this.tasks.findIndex(task => task.fertig && task.beschreibung === this.erledigt[index].beschreibung);
                if (taskIndex > -1) {
                    this.tasks[taskIndex].fertig = !this.tasks[taskIndex].fertig
                }
            }

            const userId = localStorage.getItem('user_id');
            this.sendTasksToServer(userId, this.tasks);

        },
        logout(){
            const logout = new CustomEvent('logout', {});
            localStorage.setItem('login', '');
            window.dispatchEvent(logout);
        },
        notCoded(){
            alert("Funktion noch nicht eingebunden.")
        },
        async sendTasksToServer(userId, tasks) {
        // Überprüfen, ob die Aufgaben im richtigen Format vorliegen
        const formattedTasks = tasks.map(task => ({
            beschreibung: task.beschreibung,
            fertig: task.fertig,
            user_id: task.user_id
        }));

        try {
            const response = await fetch('https://philippk.name/ToDoApp/save_tasks.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, tasks: formattedTasks })
            });
            const data = await response.json();

            if (data.success) {
                console.log('Tasks erfolgreich gespeichert');

                const username = localStorage.getItem('username');
                if (!userId || !username) {
                    console.error('Benutzer-ID oder Benutzername fehlt');
                    return;
                }

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
            } else {
                console.error('Fehler beim Speichern der Tasks:', data.error);
            }
        } catch (error) {
            console.error('Fehler:', error);
        }
    },
    },
    computed: {
        nichterledigt() {
            return this.tasks.filter(task => !task.fertig);
        },
        erledigt() {
            return this.tasks.filter(task => task.fertig);
        },
    },

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
