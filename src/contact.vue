<template>
    <div id="holder">
      <div id="navHolder">
        <Nav/>
      </div>
      <main>
        <div id="contact">
            <form action="contact.php" method="POST" id="contact_form">
              <div class="form_Row">
                <label for="name" class="labelBefor"><span class="required">Name:</span></label>
                <input class="form_input" type="text" name="name" id="name" style="width: 150%;" required>
              </div>
              <div class="form_Row">
                <label for="mail" class="labelBefor">Email:</label>
                <input class="form_input" type="text" name="mail" id="mail" style="width: 150%;">                 
              </div>
              <div class="form_Row">
                <label for="message" class="labelBefor"><span class="required">Nachricht:</span></label>
                <textarea name="message" id="message" style="width: 150%;" required></textarea>
              </div>
              <input type="submit" value="Absenden" id="submit_Contact">
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
      }
    }
</script>
  0
  <style scoped>
  /* Deine Styles hier */
  </style>
  