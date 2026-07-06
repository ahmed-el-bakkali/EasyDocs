import { supabaseClient } from "../config/supabase.js";

export async function getCurrentUser() {

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.error(error);
        return null;}

    return user;

}
export async function loadCurrentUser() {

    const {data: { user }} = await supabaseClient.auth.getUser();


}

export async function requireLogin() {

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return false; }

    return true;

}
