const API_URL = "https://distributed-file-storage-system.onrender.com";

// MESSAGE
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
}

// SIGNUP
window.signup = async function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Fill all fields", "red");
        return;
    }

    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "orange");
    } else {
        showMessage("✅ Signup successful", "green");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }
};

// LOGIN
window.login = async function () {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Fill all fields", "red");
        return;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.error) {
        showMessage(data.error, "red");
    } else {
        const token = data.token || data.access_token;

        localStorage.setItem("token", token);

        showMessage("✅ Login success", "green");

        setTimeout(() => {
            window.location.href = "dashboard.html";  // 🔥 FIX
        }, 800);
    }
};