<template>
    <nav>
        <button id="profile" class="add nav_button" @click="notCoded">Profil</button>
        <button id="logout" class="add nav_button" @click="logout">Logout</button>
    </nav>
    <div>
        <label id="new"><span @mousedown.prevent>Neue Aufgabe hinzufügen:</span><span id="localMessage"> Die Aufgaben werden gelöscht, sobald die Browserdaten zurückgesetzt werden oder sich jemand anderes anmeldet.</span>
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
        const storedTasks = localStorage.getItem("task");
        const vis = localStorage.getItem("visibility");
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        }
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
    },
    methods: {
        handleAddTask(task) {
            let taskLength = this.tasks.length;
            this.tasks.push({ beschreibung: task, fertig: false, ID: taskLength });
            this.tasks.reverse();
            localStorage.setItem("task", JSON.stringify(this.tasks));
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
        handleDeleteTask(taskId) {
            // Finde die Aufgabe
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            if (taskIndex > -1) {
                // Entferne die Aufgabe
                this.tasks.splice(taskIndex, 1);
            }

            // Speichere die aktualisierte Liste in localStorage
            localStorage.setItem("task", JSON.stringify(this.tasks));
        },
        handleToggleTaskStatus(taskId) {
            // Finde die Aufgabe und toggle den Status
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.fertig = !task.fertig;
            }

            localStorage.setItem("task", JSON.stringify(this.tasks));
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
        }
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

    #localMessage{
        font-size: .75rem;
        font-style: italic;
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
