<template>
    <ul id="finished">
        <TaskDetails :tasks 
            @update-goal-date="updateGoalDate" 
            @delete-task="loeschen"
            @toggle-task-status="erledigtWechseln"
        />    
    </ul>
</template>

<script>
import TaskDetails from './tasks.vue'

export default {
    props: ['tasks'],
    components: {
        TaskDetails
    },
    methods: {
        loeschen(taskId) {
            this.$emit('delete-task', taskId);
        },
        erledigtWechseln(taskId) {
            this.$emit('toggle-task-status', taskId);
        },
        updateGoalDate(taskId, formattedDate) {
            console.log(taskId, formattedDate);
            const id = taskId;
            const date = formattedDate;

            this.$emit('update-goal-date', id, date );
        }
    }
};
</script>

<style>
</style>
