<template>
    <input type="text" id="new_task" v-model="newTask" @keyup.enter="handleAddTask">
    <button class="add" @click="handleAddTask">Hinzufügen</button>
</template>

<script>
export default {
    data() {
        return {
            newTask: ""
        };
    },
    methods: {
        handleAddTask() {
            if (this.newTask.trim() !== "") {
                this.$emit('add-task', this.newTask); // Ereignis 'add-task' emittieren
                this.newTask = ""; // Eingabefeld zurücksetzen
                document.getElementById('new_task').focus(); // Fokus setzen
            }
        }
    }
};
</script>

<style>
    #new_task{
        border: 1.9px solid black;
        width: 90%;
        border-radius: 1.5rem;
        padding: 1rem;

    }

    .add{
        width: 10%;
        min-width: fit-content;
        border-radius: 1.5rem;
        border: 1.9px solid black;
        padding: .7rem;
        font-size: 1.4rem;
        cursor: pointer;
        margin-top: 0.7rem;
        text-align: center;
    }
    


    @media only screen and (max-width: 530px) {
    .add{
        font-size: 0.8rem;
        }
    }
</style>