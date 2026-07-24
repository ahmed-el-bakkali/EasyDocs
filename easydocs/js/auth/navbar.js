import { getCurrentUser } from "./session.js";
import { logout } from "./auth.js";

export async function updateNavbar() {

    /*const user = await getCurrentUser();

    const profileLink = document.getElementById("profileLink");
    const uploadLink = document.getElementById("uploadLink");
    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutBtn");

    if (user) {

        if (profileLink) profileLink.style.display = "";
        if (uploadLink) uploadLink.style.display = "";
        if (logoutLink) {
            logoutLink.style.display = "";
            logoutLink.addEventListener("click", logout);}
        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";

    }

    else {

        if (profileLink) profileLink.style.display = "none";
        if (uploadLink) uploadLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
        if (loginLink) loginLink.style.display = "";
        if (signupLink) signupLink.style.display = "";

    }*/

    const user = await getCurrentUser();
    const navbarLinks = document.getElementById("navbarLinks");

    // Stop if the page doesn't have a navbar
    if (!navbarLinks) return;

    if (user) {

        // Navbar for logged-in users
        navbarLinks.innerHTML = `
            <a href="index.html" id="homeLink">Home</a>
            <a href="profile.html" id="profileLink">Profile</a>
            <a href="upload.html" id="uploadLink">Upload</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;

        // Add logout functionality
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", logout);

    } else {

        // Navbar for logged-out users
        navbarLinks.innerHTML = `
            <a href="index.html" id="homeLink">Home</a>
            <a href="login.html" id="loginLink">Login</a>
            <a href="signup.html" id="signupLink">Sign Up</a>
        `;
    }
}


