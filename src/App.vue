<template>
  <div id="holder">
    <div id="navHolder">
      <Nav/>
    </div>
    <main>
      <section id="aboutMe">
        <p class="meText">
          <img id="me" class="img-fluid" src="/public/ich.png" alt="It's me :)">
          <span class="headerMe">Wer bin ich: <br></span>Mein Name ist Philipp Kraut. Ich bin ein junger, dem Coden verfallener Mann, welcher sich in den Tiefen von JavaScript verloren hat.
          <br>
          <br>
          Bereits seit meinem 12. Lebensjahr träume ich davon zu programmieren. Nach einigen Anläufen entdeckte ich dann irgendwann JavaScript für mich. Das war der Tag an dem sich alles geändert hat. Ich hatte mich verliebt.
          <br><br>
          Das bedeutet für mich, dass dies hier meine erste Homepage ist. Anbinden werde ich mit und mit Projekte an denen ich arbeite.
          <br><br>
          Über Feedback, Ideen und natürlich Jobangebote würde ich mich sehr freuen. Nutzt hierfür gerne das <a href="#" @click="contact">Kontaktformular</a>. Ich freue mich bereits darauf :)
        </p>
      </section>
    </main>
    <footer>
    </footer>
  </div>
</template>

<script>

const contact = new CustomEvent('contact', {});
const home = new CustomEvent('home', {});

import Nav from "./components/nav.vue"

export default {
  methods: {
    contact() {
      window.dispatchEvent(contact);
    },
    home(){
      window.dispatchEvent(home);
    }
  },
  components: {
    Nav
  }
}
</script>

<style scoped>
/* Deine Styles hier */
</style>
