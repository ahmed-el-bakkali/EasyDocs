console.log("JS LOADED");
console.log(supabaseClient);

const schoolSelect = document.getElementById("school");
const signupForm = document.getElementById("signupForm");

initSignupPage();

async function initSignupPage() {

    await updateNavbar();

    await loadSchools();

    signupForm.addEventListener("submit", signUp);

}