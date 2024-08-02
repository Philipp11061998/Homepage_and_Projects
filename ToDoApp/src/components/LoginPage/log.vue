<template>
    <form @submit.prevent="handleLogin">
        <label for="username">Username:</label>
        <br>
        <input type="text" name="username" id="username" required>
        <br>
        <label for="password">Passwort:</label>
        <br>
        <input type="password" name="password" id="password" required>
        <br>
        <input type="submit" value="Anmelden">
    </form>
</template>

<script>
export default {
    methods: {
        handleLogin() {
            // Hier die Login-Logik hinzufügen
            const userna = document.getElementById("username").value;
            const pass = document.getElementById("password").value;
            this.$emit('login', {username: userna, password: pass});
        }
    }
};
</script>
