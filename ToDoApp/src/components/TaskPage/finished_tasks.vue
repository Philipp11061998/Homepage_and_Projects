<template>
    <ul id="finished">
        <li v-for="task in tasks" :key="task.id">
            <div class="task">
                <div class="firstRow">
                    <span class="NurTextLineThrough">{{ task.beschreibung }}</span>
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
        },updateGoalDate(taskId, event) {
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

<style>
    .NurTextLineThrough {
        color: red;
        text-decoration: line-through;
    }
</style>
