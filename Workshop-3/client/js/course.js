let coursesCache = [];
let teachersCache = [];

function showJSON(obj) {
    document.getElementById("result").textContent = JSON.stringify(obj, null, 2);
}

// * Courses
function loadCoursesIntoSelect(courses) {
    const select = document.getElementById("coursesSelect");
    select.innerHTML = "";
    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course._id;
        option.textContent = course.name;
        select.appendChild(option);
    })
};

function getCourses() {
    fetch("/course")
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            coursesCache = data;
            loadCoursesIntoSelect(data);
        })
        .catch(error => showMessage("Error al cargar cursos", true));
}

function createCourse() {
    const course = {
        name: document.getElementById("name").value,
        code: document.getElementById("code").value,
        description: document.getElementById("description").value,
        teacherId: document.getElementById("teacher").value,
    }
    fetch("/course", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            getCourses();
        })
        .catch(error => showMessage("Error al crear curso", true));
}

function updateCourse() {
    const id = document.getElementById("_id").value;
    const name = document.getElementById("name").value;
    const code = document.getElementById("code").value;
    const description = document.getElementById("description").value;
    const teacher = document.getElementById("teacher").value;
    const course = {
        _id,
        name,
        code,
        description,
        teacher
    }
    fetch(`/course?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(course)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            getCourses();
        })
        .catch(error => showMessage("Error al actualizar curso", true));
}

function deleteCourse() {
    const id = document.getElementById("_id").value;
    fetch(`/course?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            _id: id
        })
    })
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            getCourses();
        })
        .catch(error => showMessage("Error al eliminar curso", true));
}

// * Teacher

function loadTeachersIntoSelect(teachers) {
    const select = document.getElementById("teacher");
    select.innerHTML = "";
    teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher._id;
        option.textContent = teacher.name;
        select.appendChild(option);
    })
};

function getTeachers() {
    fetch("/teacher")
        .then(response => {
            if (!response.ok) throw new Error("Error");
            return response.json();
        })
        .then(data => {
            teachersCache = data;
            loadTeachersIntoSelect(data);
        })
        .catch(error => showMessage("Error al cargar docentes", true));
}

function selectCourse(courseData) {
    document.getElementById("_id").value = courseData._id;
    document.getElementById("name").value = courseData.name;
    document.getElementById("code").value = courseData.code;
    document.getElementById("description").value = courseData.description;
    document.getElementById("teacher").value = courseData.teacher;
}

document.addEventListener('DOMContentLoaded', () => {
    getCourses();
    getTeachers();
    const select = document.getElementById("coursesSelect");
    select.addEventListener("change", () => {
        const selectedId = select.value;
        const selectedCourse = coursesCache.find(course => course._id === selectedId);
        if (selectedCourse) selectCourse(selectedCourse);
    });

});



