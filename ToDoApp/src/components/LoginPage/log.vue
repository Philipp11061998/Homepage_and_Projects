<template>
    <form @submit.prevent="handleLogin" autocomplete="off" >
        <label for="username">Username:</label>
        <br>
        <input type="text" name="username" id="username" required>
        <br>
        <br>
        <label for="password">Passwort:</label>
        <br>
        <input type="password" name="password" id="password" required>
        <br>
        <br>
        <input type="submit" value="Anmelden" id="submit_Reg_Log">
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
