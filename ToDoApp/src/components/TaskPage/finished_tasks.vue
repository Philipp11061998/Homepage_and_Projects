<template>
    <ul id="finished">
        <li v-for="(task, index) in tasks" :key="task.beschreibung">
            <p class="task"><span class="NurTextLineThrough">{{task.beschreibung}}</span>
                <button class="erledigtWechseln" @click="erledigtWechseln(index)">&#10003;</button>
                <button class="loeschen" @click="loeschen(index)">X</button>
            </p>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['tasks'],
    methods: {
        loeschen(index) {
            this.$emit('delete-task', 'finished', index);
        },
        erledigtWechseln(index) {
            this.$emit('toggle-task-status', 'finished', index);
        }
    }
};
</script>

<style>
    .NurTextLineThrough
    {   
        color: red;
        text-decoration: line-through
    }

</style>
