const API_URL = "https://distributed-file-storage-system.onrender.com";

// CHECK LOGIN
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// SHOW MESSAGE
function showMessage(msg, color) {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
}

// SET USERNAME
function setUsername() {
    const payload = JSON.parse(atob(token.split(".")[1]));
    document.getElementById("usernameDisplay").innerText = payload.sub;
}

// UPLOAD
async function uploadFile() {
    const file = document.getElementById("fileInput").files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token
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
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();

    if (!data.files) return;

    const list = document.getElementById("fileList");

    list.innerHTML = data.files.map(file => `
        <li>
            ${file.filename}
            <button onclick="downloadFile('${file.filename}')">Download</button>
            <button onclick="deleteFile('${file.filename}')">Delete</button>
        </li>
    `).join("");
}

// DOWNLOAD
function downloadFile(filename) {
    window.open(`${API_URL}/download/${filename}?token=${token}`);
}

// DELETE
async function deleteFile(filename) {
    await fetch(`${API_URL}/delete/${filename}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token
        }
    });

    loadFiles();
}

window.onload = () => {
    setUsername();
    loadFiles();
};