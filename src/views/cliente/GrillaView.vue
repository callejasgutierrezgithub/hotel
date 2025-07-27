<template>
  <div class="table-container">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar por nombre, DNI, email o teléfono"
      class="search-input"
    />

    <table class="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>DNI</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#</td>
          <td><input v-model="newClient.name" placeholder="Nombre" /></td>
          <td><input v-model="newClient.dni" placeholder="DNI" /></td>
          <td><input v-model="newClient.email" placeholder="Email" /></td>
          <td><input v-model="newClient.phone" placeholder="Teléfono" /></td>
          <td><input v-model="newClient.address" placeholder="Dirección" /></td>
          <td>
            <button class="btn add" @click="addClient">Agregar</button>
          </td>
        </tr>
        <tr v-for="client in filteredClients" :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.dni }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ client.address }}</td>
          <td>
            <button class="btn edit" @click="editClient(client)">Editar</button>
            <button class="btn delete" @click="deleteClient(client.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content">
        <h2>Editar Cliente</h2>
        <label>
          Nombre: <input v-model="selectedClient.name" class="search-input" />
        </label>
        <label>
          DNI: <input v-model="selectedClient.dni" class="search-input" />
        </label>
        <label>
          Email: <input v-model="selectedClient.email" class="search-input" />
        </label>
        <label>
          Teléfono: <input v-model="selectedClient.phone" class="search-input" />
        </label>
        <label>
          Dirección: <input v-model="selectedClient.address" class="search-input" />
        </label>
        <div style="display: flex; justify-content: end; gap: 10px; margin-top: 1rem;">
          <button class="btn delete" @click="closeModal">Cancelar</button>
          <button class="btn edit" @click="saveEdit">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
export default {
  name: 'ClientesView',
  data() {
    return {
      searchQuery: '',
      clients: [],
      newClient: {
        name: '',
        dni: '',
        email: '',
        phone: '',
        address: ''
      },
      selectedClient: null,
      showEditModal: false
    };
  },
  mounted() {
    fetch('http://localhost:3000/clients')
      .then(res => res.json())
      .then(data => {
        this.clients = data;
      });
  },
  computed: {
    filteredClients() {
      const query = this.searchQuery.toLowerCase();
      return this.clients.filter(client =>
        (client.name || '').toLowerCase().includes(query) ||
        (client.dni || '').toLowerCase().includes(query) ||
        (client.email || '').toLowerCase().includes(query) ||
        (client.phone || '').toLowerCase().includes(query)
      );
    }
  },
  methods: {
    addClient() {
      fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newClient)
      })
        .then(res => res.json())
        .then(saved => {
          this.clients.push(saved);
          this.newClient = {
            name: '',
            dni: '',
            email: '',
            phone: '',
            address: ''
          };
        });
    },
    editClient(client) {
      this.selectedClient = { ...client };
      this.showEditModal = true;
    },
    deleteClient(id) {
      fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            this.clients = this.clients.filter(c => c.id !== id);
          }
        });
    },
    closeModal() {
      this.showEditModal = false;
      this.selectedClient = null;
    },
    saveEdit() {
      fetch(`http://localhost:3000/clients/${this.selectedClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selectedClient)
      })
        .then(res => {
          if (res.ok) {
            const i = this.clients.findIndex(c => c.id === this.selectedClient.id);
            if (i !== -1) {
              this.clients.splice(i, 1, { ...this.selectedClient });
            }
            this.closeModal();
          }
        });
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.btn {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn.edit {
  background-color: #0cb1fd;
  color: white;
}

.btn.edit:hover {
  background-color: #0894d6;
}

.btn.delete {
  background-color: #f44336;
  color: white;
}

.btn.delete:hover {
  background-color: #d32f2f;
}

.btn.add {
  background-color: #4caf50;
  color: white;
}

.btn.add:hover {
  background-color: #388e3c;
}

/* INPUT BUSCADOR */
.search-input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  box-sizing: border-box;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  min-width: 800px; 
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-container {
  margin: 0px;
  
  padding: 1rem;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.2rem;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-table thead {
  background-color: #5a5a5af1;
  color: white;
}

.custom-table th,
.custom-table td {
  padding: 7px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  font-size: 12px;
}

.custom-table tbody tr:hover {
  background-color: #f1f3f5;
  transition: background-color 0.3s;
}
</style>
