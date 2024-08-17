<template>
    <li v-for="task in tasks" :key="task.id">        
        <div class="task">
            <div class="rows">
                <div class="firstRow">
                <span :class="{ NurTextLineThrough: task.fertig }">{{ task.beschreibung }}</span>
                </div>
                <div class="additionalStuff secondRow">
                    <div v-if="task.Goal_Date">
                        <hr>
                        <div class="goalDateFilled" :ref="'date-' + task.id">Erledigen bis: {{ task.Goal_Date }}</div> 
                        <input type="datetime-local" :ref="'datePicker-' + task.id" 
                        @change="updateGoalDate(task.id, $event)" style="display: none;">
                    </div>
                    <div v-else>
                        <hr>
                        <div class="goalDateUnfilled" :ref="'noDate-' + task.id" 
                        @click="openDatePicker(task.id)">Bitte wähle ein Zieldatum.</div>
                        <input class="goalDate" type="datetime-local" :ref="'datePicker-' + task.id" @change="updateGoalDate(task.id, $event)" style="display: none;">
                    </div>
                </div>
            </div>
            <div class="status">
                    <button class="erledigtWechseln" @click="erledigtWechseln(task.id)">&#10003;</button>
                    <button class="loeschen" @click="loeschen(task.id)">X</button>
                    <button class="changeDate" @click="openDatePicker(task.id)">
                        &#128197;
                    </button>
            </div>
        </div>
    </li>
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
                const datePicker = this.$refs['datePicker-' + taskId];
                const actualDate = this.$refs['date-' + taskId];
                const noDate = this.$refs['noDate-' + taskId];

                if (datePicker && datePicker[0]) {
                    if (actualDate && actualDate[0]) {
                        actualDate[0].style.display = 'none';
                    }

                    if (noDate && noDate[0]) {
                        noDate[0].style.display = 'none';
                    }

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

            if (noDate && noDate[0]) {
                noDate[0].style.display = 'block';
            }

            datePicker[0].style.display = 'none';

            // Datum konvertieren
            const formattedDate = this.convertDate(dateValue);

            // Event auslösen und ein Objekt übergeben
            this.$emit('update-goal-date', taskId, formattedDate );
        },
        convertDate(dateString) {
            // Datum im Format YYYY-MM-DDTHH:MM parsen
            const [datePart, timePart] = dateString.split('T');
            const [year, month, day] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            
            // Datum im Format DD.MM.YYYY, HH:MM Uhr formatieren
            return `${day}.${month}.${year}, ${hour}:${minute} Uhr`;
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
        flex-direction: row;
        margin: 0.5rem;
        padding: 0.9rem;
        border: 1.9px solid black;
        border-radius: 0.7rem;
        background-color: white;
        justify-content: space-between;
    }

    .rows{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        padding-right: 1rem;
        padding-left: .7rem;
    }

    .firstRow {
        display: flex;
        flex-direction: row;
        width: 100%;
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
    }

    .erledigtWechseln {
        margin-left: auto;
        background-color: green;
    }

    .loeschen {
        background-color: red;
    }

    .NurTextLineThrough {
        color: red !important;
        text-decoration: line-through;
    }
</style>
