const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Auth check
function getToken() {
    return localStorage.getItem("token");
}

if (!getToken()) {
    window.location.href = "/";
}

// 🔹 Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

// 🔹 Message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => box.innerText = "", 3000);
}

// 🔹 Upload
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

    if (res.status === 401) {
        logout();
        return;
    }

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        showMessage("Uploaded!", "green");
        loadFiles();
    }
}

// 🔹 Load files
async function loadFiles() {
    const res = await fetch(`${API_URL}/files`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    if (res.status === 401) {
        logout();
        return;
    }

    const data = await res.json();

    const list = document.getElementById("fileList");

    if (!data.files || data.files.length === 0) {
        list.innerHTML = "<p>No files found</p>";
        return;
    }

    let html = "";

    data.files.forEach(file => {
        html += `
        <li>
            📄 ${file.filename} (${(file.size / 1024).toFixed(2)} KB)
            <button onclick="downloadFile('${file.filename}')">⬇</button>
            <button onclick="deleteFile('${file.filename}')">🗑</button>
        </li>`;
    });

    list.innerHTML = html;
}

// 🔹 Download
function downloadFile(filename) {
    window.open(`${API_URL}/download/${filename}?token=${getToken()}`);
}

// 🔹 Delete
async function deleteFile(filename) {
    const res = await fetch(`${API_URL}/delete/${filename}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    });

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        showMessage("Deleted", "green");
        loadFiles();
    }
}

// 🔹 Username
function setUsername() {
    const token = getToken();
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    document.getElementById("usernameDisplay").innerText = payload.sub;
}

// 🔹 Init
window.onload = () => {
    setUsername();
    loadFiles();
};