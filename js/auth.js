console.log("Auth JS Loaded 🚀");

const API_URL = "https://distributed-file-storage-system.onrender.com";

// 🔹 Message
function showMessage(msg, color = "white") {
    const box = document.getElementById("messageBox");
    box.innerText = msg;
    box.style.color = color;
}

// 🔹 SIGNUP
window.signup = async function () {
    console.log("Signup clicked");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Fill all fields", "red");
        return;
    }

    try {
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
                window.location.href = "login.html";
            }, 1000);
        }

    } catch (err) {
        console.error(err);
        showMessage("❌ Server error", "red");
    }
};

// 🔹 LOGIN
window.login = async function () {
    console.log("Login clicked");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        showMessage("❌ Fill all fields", "red");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        console.log("Login response:", data);

        if (data.error) {
            showMessage(data.error, "red");
        } else {
            // ✅ IMPORTANT FIX
            const token = data.token || data.access_token;

            localStorage.setItem("token", token);

            showMessage("✅ Login success", "green");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        }

    } catch (err) {
        console.error(err);
        showMessage("❌ Server error", "red");
    }
};