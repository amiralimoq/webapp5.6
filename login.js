"use strict";

const supabaseUrl = "https://gfsvfxxlpkgvrbbxkztx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmc3ZmeHhscGtndnJiYnhrenR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NDE3ODUsImV4cCI6MjAzMTQxNzc4NX0.sPgy4P-21IeSo1f31JvOFyS92fA_9N5h3D_1N5VBNuM";
const dbClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// Login function
const handleLogin = async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password.";
        return;
    }

    // Check credentials against the database
    let { data: users, error } = await dbClient
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password);

    if (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        console.error("Supabase error:", error.message);
        return;
    }

    // Check if a user was found
    if (users && users.length > 0) {
        const user = users[0];
        
        // **CRITICAL STEP**: Save user data to localStorage
        // The key 'user' must match the key checked in admin.js
        localStorage.setItem("user", JSON.stringify({ name: user.name, username: user.username }));

        // Redirect to the admin page
        window.location.href = "admin.html";

    } else {
        // If no user was found
        errorMessage.textContent = "Invalid username or password.";
    }
};

// Event Listener for the login button
loginBtn.addEventListener("click", handleLogin);

// Also allow login by pressing Enter in the password field
passwordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleLogin();
    }
});
