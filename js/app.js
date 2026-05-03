const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Get token
function getToken() {
    return localStorage.getItem("token");
}

// 🔹 Check auth
function checkAuth() {
    const token = getToken();

    if (!token || token === "undefined" || token === "null") {
        window.location.href = "login.html";
    }
}

// 🔹 Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔹 Message
function showMessage(msg, color) {
    const box = document.getElementById("messageBox");
    if (!box) return;

    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => box.innerText = "", 3000);
}

// 🔹 Upload
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

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
        showMessage("Uploaded ✅", "green");
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

    const data = await res.json();
    const list = document.getElementById("fileList");

    if (!data.files) return;

    let html = "";

    data.files.forEach(file => {
        html += `
        <li class="file-item">
            <div>
                📄 <strong>${file.filename}</strong><br>
                <small>${(file.size / 1024).toFixed(2)} KB</small>
            </div>

            <div class="actions">
                <button onclick="downloadFile('${file.filename}')">⬇</button>
                <button onclick="deleteFile('${file.filename}')">🗑</button>
            </div>
        </li>`;
    });

    list.innerHTML = html;
}

// 🔹 Download
function downloadFile(filename) {
    const token = getToken();
    window.open(`${API_URL}/download/${filename}?token=${token}`);
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
        showMessage("Deleted ✅", "green");
        loadFiles();
    }
}

// 🔹 Dropdown
function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("hidden");
}

// 🔹 Username
function setUsername() {
    const token = getToken();
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    document.getElementById("usernameDisplay").innerText = payload.sub;
}

// 🔹 INIT
window.onload = () => {
    checkAuth();     // 🔥 VERY IMPORTANT
    setUsername();
    loadFiles();
};