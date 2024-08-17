<template>
    <ul id="unfinished">
        <li v-for="task in tasks" :key="task.id">
            <div class="task">
                <div class="firstRow">
                    {{ task.beschreibung }}
                    <div class="Status">
                        <button class="erledigtWechseln" @click="erledigtWechseln(task.id)">&#10003;</button>
                        <button class="loeschen" @click="loeschen(task.id)">X</button>
                        <button class="changeDate" @click="openDatePicker(task.id)">
                            &#128197;
                        </button>
                    </div>
                </div>
                <div class="additionalStuff secondRow">
                    <div class="dateFilled" v-if="task.Goal_Date">
                        <div :ref="'date-' + task.id">Bis: {{ task.Goal_Date }}</div> 
                        <input type="date" :ref="'datePicker-' + task.id" @change="updateGoalDate(task.id, $event)" style="display: none;">
                    </div>
                    <div v-else>
                        <div :ref="'noDate-' + task.id">Bitte gib ein Zieldatum ein.</div>
                        <input type="date" :ref="'datePicker-' + task.id" @change="updateGoalDate(task.id, $event)" style="display: none;">
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['tasks'],
    methods: {
        loeschen(taskId) {
            this.$emit('delete-task', taskId);
        },
        erledigtWechseln(taskId) {
            this.$emit('toggle-task-status', taskId);
        },
        openDatePicker(taskId) {
            this.$nextTick(() => {
                // Dynamischer Zugriff auf die spezifische Referenz basierend auf der Task-ID
                const datePicker = this.$refs['datePicker-' + taskId];
                const actualDate = this.$refs['date-' + taskId];
                const noDate = this.$refs['noDate-' + taskId];

                if (datePicker && datePicker[0]) {
                    // Überprüfe, ob actualDate existiert und setze es auf 'none', falls vorhanden
                    if (actualDate && actualDate[0]) {
                        actualDate[0].style.display = 'none';
                    }
                    
                    // Überprüfe, ob noDate existiert und setze es auf 'none', falls vorhanden
                    if (noDate && noDate[0]) {
                        noDate[0].style.display = 'none';
                    }

                    // Sichtbar machen und öffnen des Date Pickers
                    datePicker[0].style.display = 'block';
                    datePicker[0].focus();
                    datePicker[0].click(); // Öffnet das Datumseingabefeld
                }
            });
        },
        updateGoalDate(taskId, event) {
            const dateValue = event.target.value;
            const datePicker = this.$refs['datePicker-' + taskId];
            const actualDate = this.$refs['date-' + taskId];
            const noDate = this.$refs['noDate-' + taskId];

            if (actualDate && actualDate[0]) {
                actualDate[0].style.display = 'block';
            }
            
            // Überprüfe, ob noDate existiert und setze es auf 'none', falls vorhanden
            if (noDate && noDate[0]) {
                noDate[0].style.display = 'block';
            }

            datePicker[0].style.display = 'none';


            // Datum konvertieren
            const formattedDate = this.convertDate(dateValue);

            // Event auslösen und ein Objekt übergeben
            this.$emit('update-goal-date', { taskId, goalDate: formattedDate });
        },
        convertDate(dateString) {
            // Datum im Format YYYY-MM-DD parsen
            const [year, month, day] = dateString.split('-');
            // Datum im Format DD.MM.YYYY formatieren
            return `${day}.${month}.${year}`;
        }
    }
};
</script>

<style scoped>
    li {
        list-style-type: none;
        display: flex;
        align-items: center;
    }
    
    .task {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        padding: 0.5rem;
        border: 1.9px solid black;
        border-radius: 0.7rem;
        background-color: white;
    }

    .firstRow {
        display: flex;
        flex-direction: row;
    }

    .Status {
        margin-left: auto;
        display: flex;
        flex-direction: row;
    }

    .secondRow {
        display: flex;
        flex-direction: row;
    }

    button {
        height: 1.65rem;
        width: 1.65rem;
        margin-left: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid black;
        border-radius: 0.4rem;
        cursor: pointer;
        font-weight: bolder;
    }

    .erledigtWechseln {
        margin-left: auto;
        background-color: green;
    }

    .loeschen {
        background-color: red;
    }
</style>
