<template>
    <ul id="unfinished">
        <li v-for="task in tasks" :key="task.id">
            <div class="task">
                <div class="firstRow">
                    {{ task.beschreibung }}
                    <div class="Status">
                        <button class="erledigtWechseln" @click="erledigtWechseln(task.id)">&#10003;</button>
                        <button class="loeschen" @click="loeschen(task.id)">X</button>
                    </div>
                </div>
                <div class="additionalStuff secondRow">
                    <div v-if="task.Goal_Date">
                        {{ task.Goal_Date }}
                    </div>
                    <div v-else>
                        <input
                        placeholder="Zieldatum eintragen."
                        class="textbox-n"
                        type="text"
                        onfocus="(this.type='date')"
                        onblur="(this.type='text')"
                        id="date"
                        @input="updateGoalDate(task.id, $event)"
                    />
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
        updateGoalDate(taskId, event) {
            const dateValue = event.target.value;

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

<!--CSS für finished_tasks; unfinished_tasks; all_tasks-->
<style>
    li{
            list-style-type: none;
            display: flex;
            align-items: center;
    }
    
    .task{
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        padding: .5rem;
        border: 1.9px solid black;
        border-radius: 0.7rem;
        background-color: white;

        .firstRow{
            display: flex;
            flex-direction: row;

            .Status{
                margin-left: auto;
                display: flex;
                flex-direction: row;
            }
        }

        .secondRow{
            display: flex;
            flex-direction: row;
        }

        button{
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
    }

    .erledigtWechseln{
            margin-left: auto;
            background-color: green;

    }

    .finished{
                background-color: red;
                text-decoration: none;
    }

    .loeschen{
        background-color: red;
    }
</style>
