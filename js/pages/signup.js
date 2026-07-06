console.log("JS LOADED");

const schoolSelect = document.getElementById("school");
const signupForm = document.getElementById("signupForm");

import { signUp } from "../auth/auth.js";
import { updateNavbar } from "../auth/navbar.js";
import { loadSchools } from "../api/academic.js";
import { showToast } from "../ui/toast.js";

initSignupPage();

async function initSignupPage() {

    await updateNavbar();

    await loadSchools(schoolSelect);

    signupForm.addEventListener("submit", signUp);

}
