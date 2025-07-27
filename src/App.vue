<template>
  <div class="layout">    
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">El Edén - Hotel 5 Estrellas</div>
      </div>
    </nav>

    <div class="main-container">
      <aside class="sidebar">
        <ul class="menu">
          <li><router-link to="/">Cliente</router-link></li>
          <li><router-link to="/habitacion">Habitación</router-link></li>
          <li><router-link to="/reservacion">Reserva</router-link></li>
          <li><router-link to="/about">Acerca</router-link></li>
        </ul>
      </aside>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}
.navbar-container {
  display: flex;
  align-items: center;
}
.navbar-logo {
  font-size: 1.3rem;
  font-weight: bold;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 150px;
  background-color: #34495e;
  color: white;
  padding: 1rem 0;
}
.menu {
  list-style: none;
  padding: 0;
}
.menu li {
  margin: 0.5rem 0;
}
.menu a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
}
.menu a.router-link-exact-active {
  background-color: #1abc9c;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
