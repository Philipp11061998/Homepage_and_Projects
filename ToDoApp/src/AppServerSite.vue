<template>
    <nav>
        <button id="profile" class="add nav_button" @click="notCoded">Profil</button>
        <button id="logout" class="add nav_button" @click="logout">Logout</button>
    </nav>
    <div>
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
</template>

<script>
import NewTask from "./components/TaskPage/newTask.vue";
import FinishedTasks from "./components/TaskPage/finished_tasks.vue";
import UnfinishedTasks from "./components/TaskPage/unfinished_tasks.vue";
import AllTasks from "./components/TaskPage/all_tasks.vue";

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

        this.$nextTick(() => {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
                console.log("Tasks wurden geladen");
            } else {
                console.log("Keine Tasks im LocalStorage gefunden.");
            }
        });
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
        notCoded(){
            alert("Funktion noch nicht eingebunden.")
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
        async ChangeGoalDate({ taskId, goalDate }) {
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
        }
    },
    computed: {
        nichterledigt() {
            return this.tasks.filter(task => !task.fertig);
        },
        erledigt() {
            return this.tasks.filter(task => task.fertig);
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
