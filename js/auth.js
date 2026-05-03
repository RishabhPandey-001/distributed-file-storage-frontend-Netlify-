console.log("Auth JS Loaded 🚀");

const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Show message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;

    setTimeout(() => {
        box.innerText = "";
    }, 3000);
}

// 🔹 SIGNUP
async function signup() {
    console.log("Signup button clicked");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Please fill all fields", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();
        console.log("Signup response:", data);

        if (data.error) {
            showMessage("⚠️ " + data.error, "orange");
        } else {
            showMessage("✅ Signup successful! Redirecting...", "lightgreen");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        }

    } catch (err) {
        console.error("Signup error:", err);
        showMessage("❌ Server error", "red");
    }
}

// 🔹 LOGIN
async function login() {
    console.log("Login button clicked");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Please fill all fields", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await res.json();
        console.log("Login response:", data);

        if (data.error) {
            showMessage("❌ " + data.error, "red");
        } else {

            localStorage.setItem("token", data.token);

            showMessage("✅ Login successful!", "lightgreen");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }

    } catch (err) {
        console.error("Login error:", err);
        showMessage("❌ Server error", "red");
    }
}