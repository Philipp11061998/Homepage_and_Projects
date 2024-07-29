<template>
    <div id="holder">
      <div id="navHolder">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <div class="navTiles">
              <a id="logo" class="navbar-brand" href="../../index.html"></a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" @click="home">Home</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Meine Projekte
                    </a>
                    <ul class="dropdown-menu" id="projects">
                      <li><a class="dropdown-item" href="../../ToDoApp/index.html">ToDo-App</a></li>
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
    </div>
</template>

<script>
  
const contact = new CustomEvent('contact', {});
const home = new CustomEvent('home', {});

export default {
  methods: {
    contact() {
      window.dispatchEvent(contact);
    },
    home(){
      window.dispatchEvent(home);
    }
  }
}
</script>