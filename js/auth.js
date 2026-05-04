const API_URL = "https://distributed-file-storage-system.onrender.com";

function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
    setTimeout(() => box.innerText = "", 3000);
}

// SIGNUP
async function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Fill all fields", "red");
        return;
    }

    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        showMessage("Signup successful!", "green");
        setTimeout(() => window.location.href = "/login.html", 1000);
    }
}

// LOGIN
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Fill all fields", "red");
        return;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.token) {
        showMessage(data.error || "Login failed", "red");
        return;
    }

    localStorage.setItem("token", data.token);

    showMessage("Login successful!", "green");

    setTimeout(() => window.location.href = "/index.html", 1000);
}