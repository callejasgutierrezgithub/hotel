<template>
  <div class="table-container">
    <h2>Gestión de Reservas</h2>

    <table class="custom-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Habitación</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- Nueva reserva -->
        <tr>
          <td>
            <select v-model="newReservation.client_id">
              <option disabled value="">Seleccione cliente</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.dni }})
              </option>
            </select>
          </td>
          <td>
            <select v-model="newReservation.room_id">
              <option disabled value="">Seleccione habitación</option>
              <option v-for="r in rooms" :key="r.id" :value="r.id">
                Habitación {{ r.number }} ({{ r.type }})
              </option>
            </select>
          </td>
          <td><input type="date" v-model="newReservation.start_date" /></td>
          <td><input type="date" v-model="newReservation.end_date" /></td>
          <td><button class="btn add" @click="addReservation">Reservar</button></td>
        </tr>

        <!-- Listado de reservas -->
        <tr v-for="r in reservations" :key="r.id">
          <td>{{ getClientName(r.client_id) }}</td>
          <td>{{ getRoomInfo(r.room_id) }}</td>
          <td>{{ r.start_date }}</td>
          <td>{{ r.end_date }}</td>
          <td>
            <button class="btn edit" @click="editReservation(r)">Editar</button>
            <button class="btn delete" @click="deleteReservation(r.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal edición -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content">
        <h2>Editar Reserva</h2>

        <label>Cliente:
          <select v-model="selectedReservation.client_id" class="search-input">
            <option disabled value="">Seleccione cliente</option>
            <option v-for="c in clients" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.dni }})
            </option>
          </select>
        </label>

        <label>Habitación:
          <select v-model="selectedReservation.room_id" class="search-input">
            <option disabled value="">Seleccione habitación</option>
            <option v-for="r in rooms" :key="r.id" :value="r.id">
              Habitación {{ r.number }} ({{ r.type }})
            </option>
          </select>
        </label>

        <label>Fecha inicio:
          <input type="date" v-model="selectedReservation.start_date" class="search-input" />
        </label>

        <label>Fecha fin:
          <input type="date" v-model="selectedReservation.end_date" class="search-input" />
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
  name: 'ReservasView',
  data() {
    return {
      clients: [],
      rooms: [],
      reservations: [],
      newReservation: {
        client_id: '',
        room_id: '',
        start_date: '',
        end_date: ''
      },
      selectedReservation: null,
      showEditModal: false
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch('http://localhost:3000/clients')
        .then(res => res.json())
        .then(data => (this.clients = data));

      fetch('http://localhost:3000/rooms')
        .then(res => res.json())
        .then(data => (this.rooms = data));

      fetch('http://localhost:3000/reservations')
        .then(res => res.json())
        .then(data => (this.reservations = data));
    },
    getClientName(id) {
      const c = this.clients.find(c => c.id === id);
      return c ? c.name : 'Desconocido';
    },
    getRoomInfo(id) {
      const r = this.rooms.find(r => r.id === id);
      return r ? `#${r.number} (${r.type})` : 'N/A';
    },
    addReservation() {
      fetch('http://localhost:3000/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newReservation)
      })
        .then(res => res.json())
        .then(saved => {
          this.reservations.push(saved);
          this.newReservation = {
            client_id: '',
            room_id: '',
            start_date: '',
            end_date: ''
          };
        });
    },
    deleteReservation(id) {
      fetch(`http://localhost:3000/reservations/${id}`, {
        method: 'DELETE'
      }).then(res => {
        if (res.ok) {
          this.reservations = this.reservations.filter(r => r.id !== id);
        }
      });
    },
    editReservation(reservation) {
      this.selectedReservation = { ...reservation };
      this.showEditModal = true;
    },
    saveEdit() {
      fetch(`http://localhost:3000/reservations/${this.selectedReservation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.selectedReservation)
      }).then(res => {
        if (res.ok) {
          const index = this.reservations.findIndex(r => r.id === this.selectedReservation.id);
          if (index !== -1) {
            this.reservations.splice(index, 1, { ...this.selectedReservation });
          }
          this.closeModal();
        }
      });
    },
    closeModal() {
      this.selectedReservation = null;
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
