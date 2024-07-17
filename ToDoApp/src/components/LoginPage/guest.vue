<template>
    <a href="#"><input type="button" value="Oder als Gast fortfahren ->" @click="SkipToTasks"></a>
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
