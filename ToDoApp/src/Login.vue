<template>
    <div id="holder_Log">
        <h1 style="color: red;">Site under construction :)</h1>
        <div id="login_Form">
            <div id="switch">
                Login <label class="switch">
                <input type="checkbox" id="reg_log">
                <span class="slider round" @click="toggleLogOrReg"></span>
                </label> Registrieren
            </div>
        <br>
        <Log v-if="LoginOrRegister.Log" @login="handleLogin($event)" />
        <Reg v-if="LoginOrRegister.Reg" @registry="handleRegistry"/>
        <br>
        <Guest @skip-local="SkipToLocal"/>
        </div>
    </div>
    
</template>

<script>
import Log from './components/LoginPage/log.vue';
import Reg from './components/LoginPage/reg.vue';
import Guest from './components/LoginPage/guest.vue';

const local = new CustomEvent('local', {});

export default {
    components: {
        Log,
        Reg,
        Guest
    },
    data() {
            return {
                LoginOrRegister: {
                    Log: true,
                    Reg: false
                }
            };
    },
    methods: {
        toggleLogOrReg() {
            this.LoginOrRegister.Log = !this.LoginOrRegister.Log;
            this.LoginOrRegister.Reg = !this.LoginOrRegister.Reg;
        },
        handleLogin: function(data) {
            const username = data.username;
            const password = data.password;
            const login = new CustomEvent('login', {
                detail: {
                    username: username,
                    password: password
                }     
            });

            window.dispatchEvent(login);
        },
        handleRegistry: function(data){
            const username = data.username;
            const password = data.password;
            const registry = new CustomEvent('registry', {
                detail: {
                    username: username,
                    password: password
                }     
            });
            window.dispatchEvent(registry);
        },  
        SkipToLocal(){
            window.dispatchEvent(local);
        }
    },
    mounted(){
            const loginValue = localStorage.getItem('login');
            if (loginValue === 'local') {
                this.$nextTick(() => {
                    window.dispatchEvent(local);
                });
            } else if (loginValue === 'server'){
                this.$nextTick(() => {
                    const server = new CustomEvent('server', {});
                    window.dispatchEvent(server);
                });
            }
    }
};

</script>
