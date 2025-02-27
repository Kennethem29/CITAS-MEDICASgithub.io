let currentUser = null;

// Usuarios predefinidos (ahora incluye usuarios para médicos)
const predefinedUsers = [
    { username: "admin", password: "admin123", type: "admin" },
    { username: "drperez", password: "perez123", type: "medico" }, // Usuario para Dr. Perez
    { username: "drgomez", password: "gomez123", type: "medico" }, // Usuario para Dra. Gomez
    { username: "drlopez", password: "lopez123", type: "medico" },  // Usuario para Dr. Lopez
    { username: "drramirez", password: "ramirez123", type: "medico" }, // Usuario para Dr. Ramirez
    { username: "drtorres", password: "torres123", type: "medico" }, // Usuario para Dra. Torres
    { username: "drsilva", password: "silva123", type: "medico" }, // Usuario para Dr. Silva
    { username: "drmorales", password: "morales123", type: "medico" }, // Usuario para Dra. Morales
    { username: "drcastro", password: "castro123", type: "medico" }, // Usuario para Dr. Castro
    { username: "drrojas", password: "rojas123", type: "medico" }, // Usuario para Dra. Rojas
    { username: "drmendoza", password: "mendoza123", type: "medico" } // Usuario para Dr. Mendoza
];
// Médicos predefinidos con más especialidades
const medicos = [
    { id: 1, nombre: "Dr. Perez", especialidad: "Cardiología", username: "drperez" },
    { id: 2, nombre: "Dra. Gomez", especialidad: "Pediatría", username: "drgomez" },
    { id: 3, nombre: "Dr. Lopez", especialidad: "Dermatología", username: "drlopez" },
    { id: 4, nombre: "Dr. Ramirez", especialidad: "Ortopedia", username: "drramirez" },
    { id: 5, nombre: "Dra. Torres", especialidad: "Ginecología", username: "drtorres" },
    { id: 6, nombre: "Dr. Silva", especialidad: "Neurología", username: "drsilva" },
    { id: 7, nombre: "Dra. Morales", especialidad: "Psiquiatría", username: "drmorales" },
    { id: 8, nombre: "Dr. Castro", especialidad: "Oftalmología", username: "drcastro" },
    { id: 9, nombre: "Dra. Rojas", especialidad: "Endocrinología", username: "drrojas" },
    { id: 10, nombre: "Dr. Mendoza", especialidad: "Oncología", username: "drmendoza" }
];

// Registro de pacientes
let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

// Citas
let citas = JSON.parse(localStorage.getItem('citas')) || [];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;

    if (userType === "paciente") {
        const paciente = pacientes.find(p => p.username === username && p.password === password);
        if (paciente) {
            currentUser = paciente;
            showPacienteScreen();
        } else {
            alert("Credenciales incorrectas o usuario no registrado.");
        }
    } else {
        const user = predefinedUsers.find(u => u.username === username && u.password === password && u.type === userType);
        if (user) {
            currentUser = user;
            if (userType === "medico") {
                showMedicoScreen();
            } else if (userType === "admin") {
                showAdminScreen();
            }
        } else {
            alert("Credenciales incorrectas.");
        }
    }
}

function showRegister() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('register-screen').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-screen').classList.add('hidden');
    document.getElementById('paciente-screen').classList.add('hidden');
    document.getElementById('medico-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function registerPaciente() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (username && password) {
        const pacienteExistente = pacientes.find(p => p.username === username);
        if (pacienteExistente) {
            alert("El nombre de usuario ya está registrado.");
        } else {
            const nuevoPaciente = { username, password, type: "paciente" };
            pacientes.push(nuevoPaciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            alert("Registro exitoso. Inicia sesión.");
            showLogin();
        }
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

function showPacienteScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('paciente-screen').classList.remove('hidden');
    showMisCitas();
}

function showMedicoScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('medico-screen').classList.remove('hidden');
    showCitasMedico();
}

function showAdminScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.remove('hidden');
    showPacientesRegistrados();
    showTodasLasCitas();
}

function showCitasMedico() {
    const medicoCitas = citas.filter(cita => cita.medico === currentUser.username);
    const content = `
        <h2>Mis Citas</h2>
        ${medicoCitas.length > 0 ? medicoCitas.map(cita => `
            <div class="cita">
                <p>Paciente: ${cita.usuario}</p>
                <p>Fecha: ${cita.fecha}</p>
                <p>Hora: ${cita.hora}</p>
                <p>Estado: ${cita.estado}</p>
                <button onclick="editarCita(${cita.id})">Editar Cita</button>
            </div>
        `).join('') : '<p>No tienes citas agendadas.</p>'}
        <button onclick="logout()">Cerrar sesión</button>
    `;
    document.getElementById('medico-content').innerHTML = content;
}

function showAgendarCita() {
    document.getElementById('paciente-content').innerHTML = `
        <h2>Agendar Nueva Cita</h2>
        <select id="medico-cita">
            ${medicos.map(medico => `<option value="${medico.username}">${medico.nombre} - ${medico.especialidad}</option>`).join('')}
        </select>
        <input type="date" id="fecha-cita" placeholder="Fecha" min="${new Date().toISOString().split('T')[0]}">
        <input type="time" id="hora-cita" placeholder="Hora">
        <button onclick="agendarCita()">Agendar Cita</button>
        <button onclick="logout()">Cerrar sesión</button>
    `;
}

function agendarCita() {
    const medico = document.getElementById('medico-cita').value;
    const fecha = document.getElementById('fecha-cita').value;
    const hora = document.getElementById('hora-cita').value;

    if (medico && fecha && hora) {
        const fechaCita = new Date(`${fecha}T${hora}`);
        const fechaActual = new Date();

        if (fechaCita < fechaActual) {
            alert("No puedes agendar citas en fechas pasadas.");
            return;
        }

        const nuevaCita = {
            id: citas.length + 1,
            usuario: currentUser.username,
            medico: medico,
            fecha: fecha,
            hora: hora,
            estado: "Pendiente"
        };
        citas.push(nuevaCita);
        localStorage.setItem('citas', JSON.stringify(citas));
        alert("Cita agendada exitosamente.");
        showMisCitas();
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

function showMisCitas() {
    const pacienteCitas = citas.filter(cita => cita.usuario === currentUser.username);
    const content = `
        <h2>Mis Citas</h2>
        ${pacienteCitas.length > 0 ? pacienteCitas.map(cita => `
            <div class="cita">
                <p>Médico: ${cita.medico}</p>
                <p>Fecha: ${cita.fecha}</p>
                <p>Hora: ${cita.hora}</p>
                <p>Estado: ${cita.estado}</p>
                <button onclick="cancelarCita(${cita.id})">Cancelar Cita</button>
            </div>
        `).join('') : '<p>No tienes citas agendadas.</p>'}
        <button onclick="logout()">Cerrar sesión</button>
    `;
    document.getElementById('paciente-content').innerHTML = content;
}

function cancelarCita(id) {
    citas = citas.filter(cita => cita.id !== id);
    localStorage.setItem('citas', JSON.stringify(citas));
    alert("Cita cancelada exitosamente.");
    showMisCitas();
}

function editarCita(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        document.getElementById('medico-content').innerHTML = `
            <h2>Editar Cita</h2>
            <p>Paciente: ${cita.usuario}</p>
            <input type="date" id="edit-fecha-cita" value="${cita.fecha}" min="${new Date().toISOString().split('T')[0]}">
            <input type="time" id="edit-hora-cita" value="${cita.hora}">
            <select id="edit-estado-cita">
                <option value="Pendiente" ${cita.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                <option value="Completada" ${cita.estado === "Completada" ? "selected" : ""}>Completada</option>
                <option value="Cancelada" ${cita.estado === "Cancelada" ? "selected" : ""}>Cancelada</option>
            </select>
            <button onclick="guardarEdicionCita(${cita.id})">Guardar Cambios</button>
            <button onclick="showCitasMedico()">Cancelar</button>
        `;
    }
}

function guardarEdicionCita(id) {
    const fecha = document.getElementById('edit-fecha-cita').value;
    const hora = document.getElementById('edit-hora-cita').value;
    const estado = document.getElementById('edit-estado-cita').value;

    const cita = citas.find(c => c.id === id);
    if (cita) {
        cita.fecha = fecha;
        cita.hora = hora;
        cita.estado = estado;
        localStorage.setItem('citas', JSON.stringify(citas));
        alert("Cita actualizada exitosamente.");
        showCitasMedico();
    }
}

function logout() {
    currentUser = null;
    showLogin();
}

// Funciones nuevas para el administrador
function showPacientesRegistrados() {
    const content = `
        <h2>Pacientes Registrados</h2>
        ${pacientes.length > 0 ? pacientes.map(paciente => `
            <div class="paciente">
                <p>Usuario: ${paciente.username}</p>
            </div>
        `).join('') : '<p>No hay pacientes registrados.</p>'}
    `;
    document.getElementById('admin-pacientes').innerHTML = content;
}

function showTodasLasCitas() {
    const content = `
        <h2>Todas las Citas</h2>
        ${citas.length > 0 ? citas.map(cita => `
            <div class="cita">
                <p>Paciente: ${cita.usuario}</p>
                <p>Médico: ${cita.medico}</p>
                <p>Fecha: ${cita.fecha}</p>
                <p>Hora: ${cita.hora}</p>
                <p>Estado: ${cita.estado}</p>
            </div>
        `).join('') : '<p>No hay citas agendadas.</p>'}
        <button onclick="logout()">Cerrar sesión</button>
    `;
    document.getElementById('admin-citas').innerHTML = content;
}