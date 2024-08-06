<template>
    <form @submit.prevent="handleRegistry" autocomplete="off">
        <label for="username">Username:</label>
        <br>
        <input
            type="text"
            name="username"
            class="user_reg"
            id="username_reg"
            v-model="username"
            required
        />
        <br>
        <br>
        <label for="password">Passwort:</label>
        <span
            id="tooltip_Password"
            class="tooltip"
            data-tooltip="Das Passwort muss mindestens eine Ziffer, einen Kleinbuchstaben, einen Großbuchstaben und ein Sonderzeichen enthalten."
        >?</span>
        <br>
        <input
            type="password"
            name="password"
            id="password_Reg"
            v-model="password"
            required
        />
        <br>
        <span v-if="passwordValid === false" class="error-message">
            Beachte die Anforderungen
            <br>
        </span>
        <br>
        <div id="reg_Log_Row">
            <input type="submit" value="Registrieren" id="submit_Reg_Log" />
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            passwordValid: null // Track password validity
        };
    },
    watch: {
        username(newUsername) {
            this.validateUsername(newUsername);
        },
        password(newPassword) {
            this.validatePassword(newPassword);
        }
    },
    methods: {
        handleRegistry() {
            if (this.passwordValid) {
                this.$emit('registry', {
                    username: this.username,
                    password: this.password
                });
            } else {
                alert("Bitte gib ein Passwort ein, welches den Anforderungen entspricht.");
            }
        },
        validateUsername(username) {
            const userInputElement = document.getElementById("username_reg");
            if (username.length > 3) {
                userInputElement.style.borderColor = "green";
            } else {
                userInputElement.style.borderColor = "red";
            }
        },
        validatePassword(password) {
            const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
            this.passwordValid = passwordPattern.test(password);
            const passwordInputElement = document.getElementById("password_Reg");
            if (this.passwordValid) {
                passwordInputElement.style.borderColor = "green";
            } else {
                passwordInputElement.style.borderColor = "red";
            }
        }
    }
};
</script>

<style scoped>
/* Entfernen des Standard-Fokusrahmens */
input:focus {
    outline: none;
}

/* Optional: Benutzerdefinierter Fokusrahmen für bessere Zugänglichkeit */
input:focus {
    outline: 2px solid #4a90e2; /* Blau, oder eine andere Farbe deiner Wahl */
    outline-offset: 2px; /* Abstand zwischen dem Rahmen und dem Eingabefeld */
}

/* Fehlermeldung */
.error-message {
    color: red;
    font-size: 0.9em;
    padding-left: .6rem;
    margin-bottom: 1rem;
}
</style>
