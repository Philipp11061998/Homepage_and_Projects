<template>
    <div id="holder">
      <div id="navHolder">
        <Nav/>
      </div>
      <main>
        <div id="contact">
            <form id="contact_form" @submit.prevent="send_Data">
              <div class="form_Row">
                <label for="name" class="labelBefor"><span class="required">Name:</span></label>
                <input class="form_input" type="text" name="name" id="name" required>
              </div>
              <div class="form_Row">
                <label for="mail" class="labelBefor">Email:</label>
                <input class="form_input" type="text" name="mail" id="mail">                 
              </div>
              <div class="form_Row">
                <label for="message" class="labelBefor"><span class="required">Nachricht:</span></label>
                <textarea name="message" id="message" required></textarea>
              </div>
              <div class="submit_Row">
                <input type="submit" value="Absenden" id="submit_Contact">
              </div>
              <div id="success"></div>
            </form>
        </div>
      </main>
      <footer>
      </footer>
    </div>
  </template>

  <script>
  import Nav from "./components/nav.vue"


  export default {
      components: {
          Nav
      },
      methods: {
        send_Data(){
            const send = new CustomEvent('send_Contact', {});
            window.dispatchEvent(send);
        }
      }
    }
</script>
  0
  <style scoped>
  /* Deine Styles hier */
  </style>
  