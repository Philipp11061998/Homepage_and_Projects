<template>
    <ul id="all">
        <li v-for="task in tasks" :key="task.id" :class="{'abgeschlossen': task.fertig}">
            <div class="task">
                <div class="firstRow">
                    {{ task.beschreibung }}
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
    props: ['tasks']
};
</script>

<style>
    .abgeschlossen {
        text-decoration: line-through;
        color: red;
    }
</style>
