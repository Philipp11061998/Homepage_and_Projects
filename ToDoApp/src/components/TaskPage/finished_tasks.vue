<template>
    <ul id="finished">
        <li v-for="task in tasks" :key="task.id">
            <p class="task">
                <span class="NurTextLineThrough">{{ task.beschreibung }}</span>
                <button class="erledigtWechseln" @click="erledigtWechseln(task.id)">&#10003;</button>
                <button class="loeschen" @click="loeschen(task.id)">X</button>
            </p>
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
