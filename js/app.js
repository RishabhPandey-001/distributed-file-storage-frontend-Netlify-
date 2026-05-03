const API_URL = "https://distributed-file-storage-system.onrender.com";

// AUTH CHECK
function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
        window.location.href = "index.html"; // 🔥 login page
    }
}

// GET TOKEN
function getToken() {
    return localStorage.getItem("token");
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html"; // 🔥 back to login
}

// MESSAGE
function showMessage(msg, color) {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
}

// UPLOAD
async function uploadFile() {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        showMessage("Select file", "red");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + getToken()
        },
        body: formData
    });

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        showMessage("Uploaded!", "green");
        loadFiles();
    }
}

// LOAD FILES
async function loadFiles() {
    const res = await fetch(`${API_URL}/files`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();
    const list = document.getElementById("fileList");

    let html = "";

    data.files.forEach(file => {
        html += `
        <li>
            📄 ${file.filename}
            <button onclick="downloadFile('${file.filename}')">⬇</button>
            <button onclick="deleteFile('${file.filename}')">🗑</button>
        </li>`;
    });

    list.innerHTML = html;
}

// DOWNLOAD
function downloadFile(name) {
    window.open(`${API_URL}/download/${name}?token=${getToken()}`);
}

// DELETE
async function deleteFile(name) {
    await fetch(`${API_URL}/delete/${name}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    loadFiles();
}

// PROFILE
function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("hidden");
}

// USERNAME
function setUsername() {
    const token = getToken();
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    document.getElementById("usernameDisplay").innerText = payload.sub;
}

// INIT
window.onload = () => {
    checkAuth();
    setUsername();
    loadFiles();
};