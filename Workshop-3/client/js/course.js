const API_BASE = "";

function showJSON(obj) {
    document.getElementById("result").textContent = JSON.stringify(obj, null, 2);
}

// Get every course
function loadCourses() {
    const ajaxRequest = new XMLHttpRequest();

    ajaxRequest.addEventListener("load", (e) => {
        try {
            const courses = JSON.parse(e.target.responseText);

            let optionsHtml = `<option value=""> -- Seleccione un curso -- </option>`;
            courses.forEach(c => {
                optionsHtml += `<option value="${c._id}">${c.name} (${c.credits} créditos)</option>`;
            });

            document.getElementById("coursesSelect").innerHTML = optionsHtml;

            showJSON(courses);
        } catch (err) {
            showJSON({
                error: "Respuesta no era JSON válido",
                raw: e.target.responseText
            });
        }
    });

    ajaxRequest.addEventListener("error", () => {
        showJSON({ error: "No se pudo conectar a la API!" });
    });

    ajaxRequest.open("GET", `${API_BASE}/course`);
    ajaxRequest.send();
}

// GET by ID Method
function loadCourseById(id) {
    if (!id) return;

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", (e) => {
        const course = JSON.parse(e.target.responseText);

        // Rellenar inputs para editar
        document.getElementById("courseId").value = course._id;
        document.getElementById("name").value = course.name ?? "";
        document.getElementById("credits").value = course.credits ?? "";

        showJSON(course);
    });

    ajaxRequest.addEventListener("error", () => {
        showJSON({ error: "Error cargando el curso por ID" });
    });

    ajaxRequest.open("GET", `${API_BASE}/course?id=${encodeURIComponent(id)}`);
    ajaxRequest.send();
}

// POST /course (crear)
function createCourse() {
    const name = document.getElementById("name").value.trim();
    const credits = Number(document.getElementById("credits").value);

    if (!name || Number.isNaN(credits)) {
        showJSON({ error: "Debes poner name y credits (número)." });
        return;
    }

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", (e) => {
        const created = JSON.parse(e.target.responseText);

        // Location header (tu API lo agrega)
        const location = ajaxRequest.getResponseHeader("Location");

        showJSON({ created, location });

        // refrescar lista
        loadCourses();
    });

    ajaxRequest.addEventListener("error", () => {
        showJSON({ error: "Error creando el curso" });
    });

    ajaxRequest.open("POST", `${API_BASE}/course`);
    ajaxRequest.setRequestHeader("Content-Type", "application/json");
    ajaxRequest.send(JSON.stringify({ name, credits }));
}

// PATCH /course?id=... (actualizar)
function updateCourse() {
    const id = document.getElementById("courseId").value.trim();
    const name = document.getElementById("name").value.trim();
    const credits = Number(document.getElementById("credits").value);

    if (!id) {
        showJSON({ error: "Primero selecciona un curso (necesito el id)." });
        return;
    }

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", (e) => {
        const updated = JSON.parse(e.target.responseText);
        showJSON(updated);
        loadCourses();
    });

    ajaxRequest.addEventListener("error", () => {
        showJSON({ error: "Error actualizando el curso" });
    });

    ajaxRequest.open("PATCH", `${API_BASE}/course?id=${encodeURIComponent(id)}`);
    ajaxRequest.setRequestHeader("Content-Type", "application/json");
    ajaxRequest.send(JSON.stringify({ name, credits }));
}

// DELETE /course?id=... (eliminar)
function deleteCourse() {
    const id = document.getElementById("courseId").value.trim();
    if (!id) {
        showJSON({ error: "Primero selecciona un curso (necesito el id)." });
        return;
    }

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", (e) => {
        const deleted = JSON.parse(e.target.responseText);
        showJSON({ deleted, message: "Eliminado" });
        document.getElementById("courseId").value = "";
        document.getElementById("name").value = "";
        document.getElementById("credits").value = "";
        loadCourses();
    });

    ajaxRequest.addEventListener("error", () => {
        showJSON({ error: "Error eliminando el curso" });
    });

    ajaxRequest.open("DELETE", `${API_BASE}/course?id=${encodeURIComponent(id)}`);
    ajaxRequest.send();
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    // cargar cursos al iniciar
    loadCourses();

    // cuando selecciono en el select, cargo ese curso
    document.getElementById("coursesSelect").addEventListener("change", (e) => {
        loadCourseById(e.target.value);
    });
});
