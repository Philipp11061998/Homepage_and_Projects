<template>
  <div id="holder">
    <div id="navHolder">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <div class="navTiles">
            <a id="logo" class="navbar-brand" href="../index.html"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="../index.html">Home</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Meine Projekte
                  </a>
                  <ul class="dropdown-menu" id="projects">
                    <li><a class="dropdown-item" href="/ToDoApp/index.html">ToDo-App</a></li>
                  </ul>
                </li>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#" @click="contact">Kontakt</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
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

export default {
  methods: {
    contact() {
      window.dispatchEvent(contact);
    }
  }
}
</script>

<style scoped>
/* Deine Styles hier */
</style>
