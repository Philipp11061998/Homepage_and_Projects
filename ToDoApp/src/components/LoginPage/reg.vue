<template>
    <form @submit.prevent="handleRegistry" autocomplete="off" >
        <label for="username">Username:</label>
        <br>
        <input type="text" name="username" id="username" required>
        <br>
        <br>
        <label for="password">Passwort:</label><span id="tooltip_Password" class="tooltip" data-tooltip="Das Passwort muss mindestens eine Ziffer, einen Kleinbuchstaben, einen Großbuchstaben und ein Sonderzeichen enthalten.">?</span>
        <br>
        <input type="password" name="password" id="password_Reg" required 
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}">
        <br>
        <br>
        <div id="reg_Log_Row">
            <input type="submit" value="Registrieren" id="submit_Reg_Log">
        </div>
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