<template>
  <div class="table-container">
    <h2>Habitaciones</h2>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar por número o tipo"
      class="search-input"
    />

    <table class="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Número</th>
          <th>Tipo</th>
          <th>Precio por noche ($)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- Nueva habitación -->
        <tr>
          <td>#</td>
          <td><input v-model="newRoom.number" placeholder="Número" /></td>
          <td><input v-model="newRoom.type" placeholder="Tipo (simple, doble...)" /></td>
          <td><input v-model="newRoom.price" type="number" placeholder="Precio" /></td>
          <td><button class="btn add" @click="addRoom">Agregar</button></td>
        </tr>

        <tr v-for="room in filteredRooms" :key="room.id">
          <td>{{ room.id }}</td>
          <td>{{ room.number }}</td>
          <td>{{ room.type }}</td>
          <td>{{ room.price.toFixed(2) }}</td>
          <td>
            <button class="btn edit" @click="editRoom(room)">Editar</button>
            <button class="btn delete" @click="deleteRoom(room.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para editar -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content">
        <h2>Editar Habitación</h2>
        <label>Número:
          <input v-model="selectedRoom.number" class="search-input" />
        </label>
        <label>Tipo:
          <input v-model="selectedRoom.type" class="search-input" />
        </label>
        <label>Precio:
          <input v-model="selectedRoom.price" type="number" class="search-input" />
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
export default {
  name: 'HabitacionesView',
  data() {
    return {
      searchQuery: '',
      rooms: [],
      newRoom: {
        number: '',
        type: '',
        price: null
      },
      selectedRoom: null,
      showEditModal: false
    };
  },
  mounted() {
    fetch('http://localhost:3000/rooms')
      .then(res => res.json())
      .then(data => {
        this.rooms = data;
      });
  },
  computed: {
    filteredRooms() {
      const q = this.searchQuery.toLowerCase();
      return this.rooms.filter(r =>
        (r.number || '').toLowerCase().includes(q) ||
        (r.type || '').toLowerCase().includes(q)
      );
    }
  },
  methods: {
    addRoom() {
      fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newRoom)
      })
        .then(res => res.json())
        .then(saved => {
          this.rooms.push(saved);
          this.newRoom = { number: '', type: '', price: null };
        });
    },
    editRoom(room) {
      this.selectedRoom = { ...room };
      this.showEditModal = true;
    },
    deleteRoom(id) {
      fetch(`http://localhost:3000/rooms/${id}`, {
        method: 'DELETE'
      }).then(res => {
        if (res.ok) {
          this.rooms = this.rooms.filter(r => r.id !== id);
        }
      });
    },
    saveEdit() {
      fetch(`http://localhost:3000/rooms/${this.selectedRoom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selectedRoom)
      }).then(res => {
        if (res.ok) {
          const index = this.rooms.findIndex(r => r.id === this.selectedRoom.id);
          if (index !== -1) {
            this.rooms.splice(index, 1, { ...this.selectedRoom });
          }
          this.closeModal();
        }
      });
    },
    closeModal() {
      this.selectedRoom = null;
      this.showEditModal = false;
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
