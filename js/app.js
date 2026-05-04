const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔐 Check login
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/login.html";
}

// Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}

// Show message
function showMessage(msg, color) {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
    setTimeout(() => box.innerText = "", 3000);
}

// Upload
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
            "Authorization": "Bearer " + token
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

// Load files
async function loadFiles() {
    const res = await fetch(`${API_URL}/files`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    if (!data.files) return;

    const list = document.getElementById("fileList");

    list.innerHTML = data.files.map(file => `
        <li>
            📄 ${file.filename} (${(file.size / 1024).toFixed(2)} KB)
            <button onclick="downloadFile('${file.filename}')">⬇</button>
            <button onclick="deleteFile('${file.filename}')">🗑</button>
        </li>
    `).join("");
}

// Download
function downloadFile(filename) {
    window.open(`${API_URL}/download/${filename}?token=${token}`);
}

// Delete
async function deleteFile(filename) {
    await fetch(`${API_URL}/delete/${filename}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadFiles();
}

// Profile
function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("hidden");
}

// Set username
function setUsername() {
    const payload = JSON.parse(atob(token.split(".")[1]));
    document.getElementById("usernameDisplay").innerText = payload.sub;
}

window.onload = () => {
    setUsername();
    loadFiles();
};