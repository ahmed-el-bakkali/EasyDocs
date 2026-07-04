console.log("JS LOADED");
console.log(supabaseClient);

const loginForm = document.getElementById("loginForm");

initLoginPage();

async function initLoginPage() {

    await updateNavbar();

    loginForm.addEventListener("submit", login);

}