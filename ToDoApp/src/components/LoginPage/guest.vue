<template>
    <input type="button" value="Als Gast fortfahren &rarr;" @click="SkipToTasks" id="logAsGuest">
</template>

<script>
export default {
    methods: {
        SkipToTasks() {
            // Hier die Login-Logik hinzufügen
            this.$emit('skip-local');
        }
    }
};
</script>