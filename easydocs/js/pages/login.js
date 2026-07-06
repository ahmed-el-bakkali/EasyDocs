console.log("JS LOADED");

const loginForm = document.getElementById("loginForm");

import { login } from "../auth/auth.js";
import { updateNavbar } from "../auth/navbar.js";
import { showToast } from "../ui/toast.js";

initLoginPage();

async function initLoginPage() {

    await updateNavbar();

    loginForm.addEventListener("submit", login);

}
