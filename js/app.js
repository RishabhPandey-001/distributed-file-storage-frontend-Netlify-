const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Check login
function getToken() {
    return localStorage.getItem("token");
}

if (!getToken()) {
    window.location.href = "login.html";
}

// 🔹 Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔹 Show message
function showMessage(msg, color) {
    const box = document.getElementById("messageBox");
    if (!box) return;

    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => box.innerText = "", 3000);
}

// 🔹 Upload file
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        showMessage("Select a file", "red");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getToken()
            },
            body: formData
        });

        if (!res.ok) {
            throw new Error("Upload failed (Unauthorized or Server Error)");
        }

        const data = await res.json();

        showMessage("Uploaded successfully ✅", "green");
        loadFiles();
        fileInput.value = "";

    } catch (err) {
        console.error(err);
        showMessage("❌ Upload failed", "red");
    }
}

// 🔹 Load files
async function loadFiles() {
    try {
        const res = await fetch(`${API_URL}/files`, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        if (!res.ok) {
            throw new Error("Unauthorized");
        }

        const data = await res.json();
        const list = document.getElementById("fileList");

        if (!list) return;

        if (!data.files || data.files.length === 0) {
            list.innerHTML = "<p>No files uploaded</p>";
            return;
        }

        let html = "";

        data.files.forEach(file => {
            html += `
            <li class="file-item">
                <div>
                    📄 <strong>${file.filename}</strong><br>
                    <small>${(file.size / 1024).toFixed(2)} KB</small>
                </div>

                <div class="actions">
                    <button class="download-btn" onclick="downloadFile('${file.filename}')">
                        ⬇ Download
                    </button>

                    <button class="delete-btn" onclick="deleteFile('${file.filename}')">
                        🗑 Delete
                    </button>
                </div>
            </li>
            `;
        });

        list.innerHTML = html;

    } catch (err) {
        console.error(err);
        showMessage("❌ Failed to load files (Login again)", "red");
        logout(); // force re-login if token invalid
    }
}

// 🔹 Download
function downloadFile(filename) {
    const token = getToken();
    window.open(`${API_URL}/download/${filename}?token=${token}`, "_blank");
}

// 🔹 Delete
async function deleteFile(filename) {
    try {
        const res = await fetch(`${API_URL}/delete/${filename}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });

        if (!res.ok) {
            throw new Error("Delete failed");
        }

        showMessage("Deleted ✅", "green");
        loadFiles();

    } catch (err) {
        console.error(err);
        showMessage("❌ Delete failed", "red");
    }
}

// 🔹 Profile dropdown
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) menu.classList.toggle("hidden");
}

// 🔹 Decode username safely
function setUsername() {
    const token = getToken();
    if (!token) return;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const el = document.getElementById("usernameDisplay");

        if (el) el.innerText = payload.sub;
    } catch {
        console.error("Invalid token");
    }
}

// 🔹 Init
window.onload = () => {
    setUsername();
    loadFiles();
};