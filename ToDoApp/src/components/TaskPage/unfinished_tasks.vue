<template>
    <ul id="unfinished">
        <li v-for="task in tasks" :key="task.id">
            <p class="task">
                {{ task.beschreibung }}
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

<!--CSS für finished_tasks; unfinished_tasks; all_tasks-->
<style>
    li{
            list-style-type: none;
            display: flex;
            align-items: center;
    }
    
    p{
        width: 100%;
        display: flex;
        margin: 0.5rem;
        padding: .5rem;
        border: 1.9px solid black;
        border-radius: 0.7rem;
        background-color: white;

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
