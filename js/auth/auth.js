import { supabaseClient } from "../config/supabase.js";
import { showToast } from "../ui/toast.js";

export async function login(event){

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

        const { data , error} = await
        supabaseClient.auth.signInWithPassword({ email: email, password: password});

        if(error){
            console.error(error);
            showToast(error.message,"error");
            return;}

            showToast("Welsome back :)","success");
    window.location.href="home.html";


}

export async function logout(event) {

    event.preventDefault();

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    window.location.href = "home.html";

}

export async function signUp(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const schoolId = document.getElementById("school").value;

    if (password !== confirmPassword) {
    showToast("Passwords do not match.","warning");
    return;}

const { data, error } = await supabaseClient.auth.signUp({ email: email, password: password});

if(error){
    console.error(error);
    showToast(error.message,"error");
    return;}

const userId = data.user.id;

const { error : userError } = await supabaseClient
.from("users").insert({ id_user : userId, username : username, id_school : schoolId});

if(userError){
    console.error(userError);
    showToast(userError.error,"error");
    return;}

 window.location.href = "home.html";

showToast("Account created succesfully! Welcome to EasyDocs","success");
}
