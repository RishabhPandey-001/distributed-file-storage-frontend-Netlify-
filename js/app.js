const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Get token safely
function getToken() {
    return localStorage.getItem("token");
}

// 🔹 Redirect if not logged in
function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
    }
}

// 🔹 Logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔹 Show message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    if (!box) return;

    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => {
        box.innerText = "";
    }, 3000);
}

// 🔹 Upload File
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        showMessage("❌ Select a file", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getToken()
            },
            body: new FormData().append("file", file)
        });

        const data = await res.json();

        if (res.status === 401) {
            logout();
            return;
        }

        if (data.error) {
            showMessage(data.error, "red");
        } else {
            showMessage("✅ Uploaded successfully", "green");
            loadFiles();
        }

    } catch (err) {
        console.error(err);
        showMessage("❌ Upload failed", "red");
    }
}

// 🔹 Load Files
async function loadFiles() {
    try {
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

        console.log("FILES RESPONSE:", data);

        const list = document.getElementById("fileList");

        if (!data.files || !Array.isArray(data.files)) {
            list.innerHTML = "<li>No files found</li>";
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
                    <button onclick="downloadFile('${file.filename}')">
                        ⬇ Download
                    </button>

                    <button onclick="deleteFile('${file.filename}')">
                        🗑 Delete
                    </button>
                </div>
            </li>
            `;
        });

        list.innerHTML = html;

    } catch (err) {
        console.error(err);
        showMessage("❌ Failed to load files", "red");
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

        if (res.status === 401) {
            logout();
            return;
        }

        const data = await res.json();

        if (data.error) {
            showMessage(data.error, "red");
        } else {
            showMessage("🗑 Deleted", "green");
            loadFiles();
        }

    } catch (err) {
        console.error(err);
        showMessage("❌ Delete failed", "red");
    }
}

// 🔹 Profile dropdown
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) {
        menu.classList.toggle("hidden");
    }
}

// 🔹 Set username from JWT
function setUsername() {
    try {
        const token = getToken();
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        document.getElementById("usernameDisplay").innerText = payload.sub;
    } catch (err) {
        console.error("Token decode error:", err);
    }
}

// 🔹 INIT
window.onload = () => {
    checkAuth();
    setUsername();
    loadFiles();
};