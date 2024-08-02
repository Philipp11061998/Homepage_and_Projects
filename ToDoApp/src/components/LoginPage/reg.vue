<template>
    <form @submit.prevent="handleRegistry">
        <label for="username">Username:</label>
        <br>
        <input type="text" name="username" id="username" required>
        <br>
        <br>
        <label for="password">Passwort:</label>
        <br>
        <input type="password" name="password" id="password_Reg" required 
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
        <br>
        <br>
        <input type="submit" value="Registrieren" id="submit_Reg_Log">
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