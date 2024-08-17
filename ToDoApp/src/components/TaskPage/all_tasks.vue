<template>
    <ul id="all">
        <li v-for="task in tasks" :key="task.id" :class="{'abgeschlossen': task.fertig}">
            <p class="task">{{ task.beschreibung }}</p>
        </li>
    </ul>
</template>

<script>
export default {
    props: ['tasks']
};
</script>

<style>
    .abgeschlossen {
        text-decoration: line-through;
        color: red;
    }
</style>
