const API_URL = "https://distributed-file-storage-system.onrender.com";

// Show message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
}

// SIGNUP
async function signup() {
    console.log("SIGNUP CLICKED");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("SIGNUP RESPONSE:", data);

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        showMessage("Signup successful", "green");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }
}

// LOGIN
async function login() {
    console.log("LOGIN CLICKED");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!data.token) {
        showMessage("Login failed", "red");
        return;
    }

    // SAVE TOKEN
    localStorage.setItem("token", data.token);
    console.log("TOKEN SAVED:", localStorage.getItem("token"));

    showMessage("Login success", "green");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}