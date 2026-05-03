const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Show message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => box.innerText = "", 3000);
}

// 🔹 SIGNUP
async function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Fill all fields", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.error) {
            showMessage(data.error, "red");
        } else {
            showMessage("Signup success!", "green");

            setTimeout(() => {
                window.location.href = "/";
            }, 1200);
        }

    } catch (err) {
        console.error(err);
        showMessage("Server error", "red");
    }
}

// 🔹 LOGIN (🔥 FIXED)
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("Fill all fields", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        console.log("LOGIN RESPONSE:", data); // 🔥 DEBUG

        // ❌ If no token
        if (!data.token) {
            showMessage(data.error || "Login failed", "red");
            return;
        }

        // ✅ Save token
        localStorage.setItem("token", data.token);

        console.log("TOKEN SAVED:", localStorage.getItem("token")); // 🔥 DEBUG

        showMessage("Login success!", "green");

        // 🔥 IMPORTANT: Delay redirect
        setTimeout(() => {
            window.location.href = "/dashboard.html";
        }, 1500);

    } catch (err) {
        console.error(err);
        showMessage("Server error", "red");
    }
}