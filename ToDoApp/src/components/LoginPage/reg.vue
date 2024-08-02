<template>
    <form @submit.prevent="handleRegistry">
        <label for="username">Username:</label>
        <br>
        <input type="text" name="username" id="username" required>
        <br>
        <label for="password">Passwort:</label>
        <br>
        <input type="password" name="password" id="password" required>
        <br>
        <input type="submit" value="Registrieren">
        </form>
</template>

<script>
export default {
    methods: {
        handleRegistry() {
            // Hier die Login-Logik hinzufügen
            this.$emit('registry');
        }
    }
};
</script>