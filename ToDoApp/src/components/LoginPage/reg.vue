<template>
    <form @submit.prevent="handleRegistry">
            <label>Username:
                <p><input type="text" name="username" id="username" required></p>
            </label>
            <br>
            <label>Passwort:
                <p><input type="password" name="password" id="password" required></p>
            </label>
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