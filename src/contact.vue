<template>
    <div id="holder">
      <div id="navHolder">
        <Nav/>
      </div>
      <main>
        <div id="contact">
            <form action="contact.php" method="POST" id="contact_form">
                <label><span class="required" >Name:</span>
                    <input class="form_input" type="text" name="name" id="name" style="width: 150%;" required>                 
                </label>
                <label>Email:
                    <input class="form_input" type="text" name="name" id="name" style="width: 150%;">                 
                </label>
                <label>Nachricht
                  <textarea name="message" id="message" style="width: 150%;"></textarea>
                </label>
                <input type="submit" value="Absenden">
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
  
  <style scoped>
  /* Deine Styles hier */
  </style>
  