// Utility for messages
function showMessage(text, isError = false) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = text;
    msgDiv.className = isError ? 'error' : 'success';
    msgDiv.style.display = 'block';
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// --- CRUD FUNCTIONS ---

let teacherSelected = [];

function getTeachersIntoSelect(teachers) {
    const select = document.getElementById("teachersList");
    select.innerHTML = "";
    teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher._id;
        option.textContent = teacher.name;
        select.appendChild(option);
    });
}

function getTeachers() {
    fetch("/teacher")
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            showMessage("Profesores cargados exitosamente");
            teacherSelected = data;
            getTeachersIntoSelect(data);
        })
        .catch(error => showMessage("Error al cargar profesores", true));
}

function createTeacher() {
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const age = document.getElementById("age").value;

    if (!name || !lastName || !cedula || !age) {
        showMessage("Por favor complete todos los campos", true);
        return;
    }

    const teacher = { name, lastName, cedula, age };

    fetch("http://localhost:3001/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(data => {
            showMessage("Profesor creado exitosamente");
            getTeachers();
            clearForm();
        })
        .catch(error => showMessage("Error al crear", true));
}

function updateTeacher() {
    // TODO: Get ID from hidden input, and update data via PUT or PATCH /teacher
    const id = document.getElementById("_id").value;
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const age = document.getElementById("age").value;

    const teacher = { id, name, lastName, cedula, age };

    fetch(`/teacher?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(data => {
            showMessage("Profesor actualizado exitosamente");
            getTeachers();
            clearForm();
        })
        .catch(error => showMessage("Error al actualizar", true));

}

function deleteTeacher() {
    // TODO: Get ID from hidden input, and delete via DELETE /teacher
    const id = document.getElementById("_id").value;
    const name = document.getElementById("name").value;

    fetch(`/teacher?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(data => {
            showMessage("Profesor eliminado exitosamente");
            getTeachers();
            clearForm();
        })
        .catch(error => showMessage("Error al eliminar", true));
}

function selectTeacher(teacherData) {
    document.getElementById("_id").value = teacherData._id;
    document.getElementById("name").value = teacherData.name;
    document.getElementById("lastName").value = teacherData.lastName;
    document.getElementById("cedula").value = teacherData.cedula;
    document.getElementById("age").value = teacherData.age;
}

function clearForm() {
    document.getElementById("_id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("cedula").value = "";
    document.getElementById("age").value = "";
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    getTeachers();

    const select = document.getElementById("teachersList");
    select.addEventListener("change", () => {
        const selectedId = select.value;
        const selectedTeacher = teacherSelected.find(teacher => teacher._id === selectedId);
        if (selectedTeacher) selectTeacher(selectedTeacher);
    });
});
