<template>
  <nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-logo">El Eden - Hotel 5 Estrellas</div>
    <ul class="navbar-menu">
      <li><a href="/cliente">Cliente</a></li>
      <li><a href="/">Habitación</a></li>
      <li><a href="/">Reserva</a></li>
      <li><a href="/about">Acerca</a></li>
    </ul>
  </div>
</nav>  
<router-view/>
</template>

<style scoped>
.navbar {
background-color: #0cb1fd;; /* Azul Bootstrap */
padding: 0.75rem 1.5rem;
color: white;
font-family: sans-serif;
}

.navbar-container {
display: flex;
justify-content: space-between;
align-items: center;
}

.navbar-logo {
font-weight: bold;
font-size: 1.25rem;
}

.navbar-menu {
list-style: none;
display: flex;
gap: 1rem;
margin: 0;
padding: 0;
}

.navbar-menu li a {
color: white;
text-decoration: none;
transition: color 0.3s;
}

.navbar-menu li a:hover {
color: #ffc107; /* Amarillo Bootstrap */
}
</style>
